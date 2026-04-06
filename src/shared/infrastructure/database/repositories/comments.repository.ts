import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUserRepository } from 'src/shared/contracts/use-cases/base.repository';
import { Comment, Prisma } from 'prisma/generated/client';

@Injectable()
export class CommentsRepository extends IBaseUserRepository {
  async create(data: Prisma.CommentUncheckedCreateInput): Promise<Comment> {
    return await this.prisma.comment.create({ data });
  }

  async findManyByCandidateId(candidateId: string): Promise<Comment[]> {
    return await this.prisma.comment.findMany({
      where: { candidateId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }

  async findOneById(commentId: string): Promise<Comment | null> {
    return await this.prisma.comment.findUnique({ where: { id: commentId } });
  }

  async updateOwnComment(params: {
    candidateId: string;
    commentId: string;
    authorId: string;
    text: string;
  }): Promise<Comment> {
    const existing = await this.findOneById(params.commentId);
    if (!existing || existing.deletedAt) throw new NotFoundException('Comment');
    if (existing.candidateId !== params.candidateId)
      throw new NotFoundException('Comment');
    if (existing.authorId !== params.authorId)
      throw new ForbiddenException('You can edit only your own comment');

    return await this.prisma.comment.update({
      where: { id: params.commentId },
      data: { text: params.text },
    });
  }

  async softDeleteOwnComment(params: {
    candidateId: string;
    commentId: string;
    authorId: string;
  }): Promise<void> {
    const existing = await this.findOneById(params.commentId);
    if (!existing || existing.deletedAt) throw new NotFoundException('Comment');
    if (existing.candidateId !== params.candidateId)
      throw new NotFoundException('Comment');
    if (existing.authorId !== params.authorId)
      throw new ForbiddenException('You can delete only your own comment');

    await this.prisma.comment.update({
      where: { id: params.commentId },
      data: { deletedAt: new Date() },
    });
  }
}

