import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionAttachmentrepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { CacheRepository } from '@/infra/cache/cache-repository';
import { Injectable } from '@nestjs/common';
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private cacheRepository: CacheRepository,
    private questionAttachmentsRepository: QuestionAttachmentrepository
  ) {}

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prisma.question.create({
      data,
    });

    await this.questionAttachmentsRepository.createMany(
      question.attachment.getItems()
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    });
    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheHIt = await this.cacheRepository.get(`question:${slug}:details`);

    if (cacheHIt) {
      const cacheData = JSON.parse(cacheHIt);

      return PrismaQuestionDetailsMapper.toDomain(cacheData);
    }

    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      },
    });
    if (!question) {
      return null;
    }

    await this.cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify(question)
    );

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question);

    return questionDetails;
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    });
    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prisma.question.delete({
      where: {
        id: data.id,
      },
    });
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await Promise.all([
      this.prisma.question.update({
        data,
        where: {
          id: data.id,
        },
      }),

      this.questionAttachmentsRepository.createMany(
        question.attachment.getNewItems()
      ),

      this.questionAttachmentsRepository.deleteMany(
        question.attachment.getRemovedItems()
      ),

      this.cacheRepository.delete(`question:${data.slug}:details`),
    ]);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }
}
