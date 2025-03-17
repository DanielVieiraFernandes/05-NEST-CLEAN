import { QuestionAttachmentrepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachement';
import { Injectable } from '@nestjs/common';
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionsAttachmentsRepository
  implements QuestionAttachmentrepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = await this.prisma.attachement.findMany({
      where: {
        questionId,
      },
    });

    return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain);
  }

  async deleteManyQuestionById(questionId: string): Promise<void> {
    await this.prisma.attachement.deleteMany({
      where: {
        questionId,
      },
    });
  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return;
    }

    const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prisma.attachement.updateMany(data);
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return;
    }

    const attachmentsIds = attachments.map(attachment => {
      return attachment.id.toString();
    });

    await this.prisma.attachement.deleteMany({
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    });
  }
}
