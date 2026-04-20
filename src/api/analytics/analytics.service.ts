import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/database/prisma.service';
import { CandidateStatus } from 'prisma/generated/enums';
import { FunnelResponseDto, FunnelStageDto } from './dto/funnel.dto';

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

@Injectable()
export class AnalyticsService {
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
}
