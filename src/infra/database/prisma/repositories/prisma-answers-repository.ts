import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswerRepository implements AnswerRepository {
  constructor(private prisma: PrismaService) {}

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await this.prisma.answer.create({
      data,
    });
  }
  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    });
  }
  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    });
    if (!answer) {
      return null;
    }

    return PrismaAnswerMapper.toDomain(answer);
  }
  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await this.prisma.answer.update({
      data,
      where: {
        id: data.id,
      },
    });
  }
  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answers.map(PrismaAnswerMapper.toDomain);
  }
}
