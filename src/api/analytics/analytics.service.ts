import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/database/prisma.service';
import { CandidateStatus, VacancyStatus } from 'prisma/generated/enums';
import { FunnelResponseDto, FunnelStageDto } from './dto/funnel.dto';
import {
  AnalyticsJobsTableResponseDto,
  AnalyticsOverviewStatsResponseDto,
  OverviewMetricDto,
} from './dto/overview.dto';

const DEFAULT_FUNNEL_ORDER: CandidateStatus[] = [
  CandidateStatus.NEW,
  CandidateStatus.SCREENING,
  CandidateStatus.INTERVIEW,
  CandidateStatus.TEST_TALK,
  CandidateStatus.OFFER,
  CandidateStatus.HIRED,
];

const STATUS_LABELS: Record<CandidateStatus, string> = {
  [CandidateStatus.NEW]: 'New',
  [CandidateStatus.SCREENING]: 'Screening',
  [CandidateStatus.INTERVIEW]: 'Interview',
  [CandidateStatus.TEST_TALK]: 'Test task / talk',
  [CandidateStatus.OFFER]: 'Offer',
  [CandidateStatus.HIRED]: 'Hired',
  [CandidateStatus.REJECTED]: 'Rejected',
};

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

function addMonths(d: Date, months: number) {
  return new Date(d.getFullYear(), d.getMonth() + months, 1, 0, 0, 0, 0);
}

function momChangePct(current: number, previous: number): number | null {
  if (!Number.isFinite(previous) || previous <= 0) return null;
  return +(((current - previous) / previous) * 100).toFixed(2);
}

function metric(current: number, previous: number): OverviewMetricDto {
  return {
    value: current,
    momChangePct: momChangePct(current, previous),
  };
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Funnel is based on the latest status per candidate (StatusHistory with max(createdAt)).
   */
  async getFunnel(): Promise<FunnelResponseDto> {
    const rows = (await this.prisma.$queryRaw<
      Array<{ status: CandidateStatus; count: bigint }>
    >`
      SELECT latest.status::text as status, COUNT(*)::bigint as count
      FROM (
        SELECT DISTINCT ON (sh."candidateId")
          sh."candidateId",
          sh.status,
          sh."createdAt"
        FROM "StatusHistory" sh
        JOIN "Candidate" c ON c.id = sh."candidateId"
        WHERE c."deletedAt" IS NULL
        ORDER BY sh."candidateId", sh."createdAt" DESC
      ) latest
      GROUP BY latest.status
    `) as Array<{ status: CandidateStatus; count: bigint }>;

    const counts = new Map<CandidateStatus, number>();
    for (const r of rows) {
      counts.set(r.status, Number(r.count));
    }

    const stages: FunnelStageDto[] = [];

    const startCount = counts.get(DEFAULT_FUNNEL_ORDER[0]) ?? 0;
    let prevCount: number | null = null;

    for (const status of DEFAULT_FUNNEL_ORDER) {
      const count = counts.get(status) ?? 0;

      const conversionFromPrevPct =
        prevCount === null
          ? null
          : prevCount === 0
            ? 0
            : (count / prevCount) * 100;

      const conversionFromStartPct =
        status === DEFAULT_FUNNEL_ORDER[0]
          ? 100
          : startCount === 0
            ? 0
            : (count / startCount) * 100;

      const dropOffFromPrev = prevCount === null ? null : prevCount - count;

      stages.push({
        status,
        label: STATUS_LABELS[status] ?? String(status),
        count,
        conversionFromPrevPct:
          conversionFromPrevPct === null
            ? null
            : +conversionFromPrevPct.toFixed(2),
        conversionFromStartPct:
          conversionFromStartPct === null
            ? null
            : +conversionFromStartPct.toFixed(2),
        dropOffFromPrev,
      });

      prevCount = count;
    }

    const totalCandidates = await this.prisma.candidate.count({
      where: { deletedAt: null },
    });

    return { stages, totalCandidates };
  }

  async getOverviewStats(): Promise<AnalyticsOverviewStatsResponseDto> {
    const now = new Date();
    const currentStart = startOfMonth(now);
    const nextStart = addMonths(currentStart, 1);
    const prevStart = addMonths(currentStart, -1);

    const openVacanciesWhereCurrent: any = {
      deletedAt: null,
      createdAt: { gte: currentStart, lt: nextStart },
      status: VacancyStatus.OPEN,
    };

    const openVacanciesWherePrev: any = {
      deletedAt: null,
      createdAt: { gte: prevStart, lt: currentStart },
      status: VacancyStatus.OPEN,
    };

    const openVacanciesFallbackWhereCurrent = {
      deletedAt: null,
      createdAt: { gte: currentStart, lt: nextStart },
    };

    const openVacanciesFallbackWherePrev = {
      deletedAt: null,
      createdAt: { gte: prevStart, lt: currentStart },
    };

    const openVacanciesCurrentPromise = this.prisma.vacancy
      .count({ where: openVacanciesWhereCurrent })
      .catch((err) => {
        this.logger.warn(
          `Vacancy.status is not available in DB schema; falling back to counting all non-deleted vacancies for openVacancies (current month).`,
        );
        this.logger.debug(String(err));
        return this.prisma.vacancy.count({
          where: openVacanciesFallbackWhereCurrent,
        });
      });

    const openVacanciesPrevPromise = this.prisma.vacancy
      .count({ where: openVacanciesWherePrev })
      .catch((err) => {
        this.logger.warn(
          `Vacancy.status is not available in DB schema; falling back to counting all non-deleted vacancies for openVacancies (previous month).`,
        );
        this.logger.debug(String(err));
        return this.prisma.vacancy.count({ where: openVacanciesFallbackWherePrev });
      });

    const [
      openVacanciesCurrent,
      openVacanciesPrev,
      newCandidatesCurrent,
      newCandidatesPrev,
      interviewOrTestCurrent,
      interviewOrTestPrev,
      hiredCurrent,
      hiredPrev,
    ] = await Promise.all([
      openVacanciesCurrentPromise,
      openVacanciesPrevPromise,
      this.prisma.candidate.count({
        where: {
          deletedAt: null,
          createdAt: { gte: currentStart, lt: nextStart },
        },
      }),
      this.prisma.candidate.count({
        where: {
          deletedAt: null,
          createdAt: { gte: prevStart, lt: currentStart },
        },
      }),
      // Candidates who entered INTERVIEW or TEST_TALK in current month
      this.prisma.statusHistory.count({
        where: {
          createdAt: { gte: currentStart, lt: nextStart },
          status: { in: [CandidateStatus.INTERVIEW, CandidateStatus.TEST_TALK] },
          candidate: { deletedAt: null },
        },
      }),
      this.prisma.statusHistory.count({
        where: {
          createdAt: { gte: prevStart, lt: currentStart },
          status: { in: [CandidateStatus.INTERVIEW, CandidateStatus.TEST_TALK] },
          candidate: { deletedAt: null },
        },
      }),
      // Candidates hired (status changed to HIRED) in current month
      this.prisma.statusHistory.count({
        where: {
          createdAt: { gte: currentStart, lt: nextStart },
          status: CandidateStatus.HIRED,
          candidate: { deletedAt: null },
        },
      }),
      this.prisma.statusHistory.count({
        where: {
          createdAt: { gte: prevStart, lt: currentStart },
          status: CandidateStatus.HIRED,
          candidate: { deletedAt: null },
        },
      }),
    ]);

    return {
      openVacancies: metric(openVacanciesCurrent, openVacanciesPrev),
      newCandidates: metric(newCandidatesCurrent, newCandidatesPrev),
      interviewOrTestCandidates: metric(
        interviewOrTestCurrent,
        interviewOrTestPrev,
      ),
      hiredCandidates: metric(hiredCurrent, hiredPrev),
    };
  }

  async getJobsTable(): Promise<AnalyticsJobsTableResponseDto> {
    const vacancies = await this.prisma.vacancy
      .findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, status: true },
      })
      .catch((err) => {
        this.logger.warn(
          `Vacancy.status is not available in DB schema; falling back to jobs-table without returning vacancy.status.`,
        );
        this.logger.debug(String(err));
        return this.prisma.vacancy.findMany({
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          select: { id: true, title: true },
        }) as any;
      });

    if (vacancies.length === 0) return { data: [] };

    const vacancyIds = vacancies.map((v) => v.id);

    // Total candidates per vacancy = applications per vacancy (unique per candidate+vacancy)
    const totals = await this.prisma.application.groupBy({
      by: ['vacancyId'],
      where: { vacancyId: { in: vacancyIds } },
      _count: { _all: true },
    });

    // Latest status per (candidateId, vacancyId) based on StatusHistory within that application
    const latestStatuses = (await this.prisma.$queryRaw<
      Array<{ vacancyId: string; status: CandidateStatus; count: bigint }>
    >`
      SELECT latest."vacancyId" as "vacancyId", latest.status::text as status, COUNT(*)::bigint as count
      FROM (
        SELECT DISTINCT ON (a."vacancyId", sh."candidateId")
          a."vacancyId",
          sh."candidateId",
          sh.status,
          sh."createdAt"
        FROM "StatusHistory" sh
        JOIN "Application" a ON a.id = sh."applicationId"
        JOIN "Candidate" c ON c.id = sh."candidateId"
        JOIN "Vacancy" v ON v.id = a."vacancyId"
        WHERE a."vacancyId" = ANY(${vacancyIds}::uuid[])
          AND c."deletedAt" IS NULL
          AND v."deletedAt" IS NULL
        ORDER BY a."vacancyId", sh."candidateId", sh."createdAt" DESC
      ) latest
      GROUP BY latest."vacancyId", latest.status
    `) as Array<{ vacancyId: string; status: CandidateStatus; count: bigint }>;

    const totalByVacancy = new Map<string, number>(
      totals.map((t) => [t.vacancyId, t._count._all]),
    );

    const byVacancyStage = new Map<string, Record<string, number>>();
    for (const row of latestStatuses) {
      const m = byVacancyStage.get(row.vacancyId) ?? {};
      m[row.status] = Number(row.count);
      byVacancyStage.set(row.vacancyId, m);
    }

    const data = vacancies.map((v: any) => {
      const stageCounts = byVacancyStage.get(v.id) ?? {};
      const interviewOrTest =
        (stageCounts[CandidateStatus.INTERVIEW] ?? 0) +
        (stageCounts[CandidateStatus.TEST_TALK] ?? 0);

      const row: any = {
        id: v.id,
        title: v.title,
        totalCandidates: totalByVacancy.get(v.id) ?? 0,
        interviewOrTest,
        offer: stageCounts[CandidateStatus.OFFER] ?? 0,
        hired: stageCounts[CandidateStatus.HIRED] ?? 0,
      };

      if (typeof v.status !== 'undefined') {
        row.status = v.status;
      }

      return row;
    });

    return { data };
  }
}
