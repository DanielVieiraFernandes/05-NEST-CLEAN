import { AnswerAttachmentrepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachement';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentrepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = await this.prisma.attachement.findMany({
      where: {
        answerId,
      },
    });

    return answerAttachments.map(PrismaAnswerAttachmentMapper.toDomain);
  }
  async deleteManyAnswerById(answerId: string): Promise<void> {
    await this.prisma.attachement.deleteMany({
      where: {
        answerId,
      },
    });
  }
}
