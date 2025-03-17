import { AnswerAttachmentrepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachement';

export class InMemoryAnswerAttachmentRepository
  implements AnswerAttachmentrepository
{
  async deleteManyAnswerById(answerId: string) {
    const answerAttachments = this.items.filter(
      item => item.answerId.toString() !== answerId
    );

    this.items = answerAttachments;
  }
  public items: AnswerAttachment[] = [];

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      item => item.answerId.toString() === answerId
    );

    return answerAttachments;
  }

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    const answerAttachments = this.items.filter(item => {
      return !attachments.some(attachment => attachment.equals(item));
    });

    this.items = answerAttachments;
  }

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      item => item.answerId.toString() !== answerId
    );

    this.items = answerAttachments;
  }
}
