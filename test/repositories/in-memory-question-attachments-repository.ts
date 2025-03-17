import { QuestionAttachmentrepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachement';

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentrepository
{
  public items: QuestionAttachment[] = [];

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const questionAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = questionAttachments
  }

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      item => item.questionId.toString() === questionId
    );

    return questionAttachments;
  }

  async deleteManyQuestionById(questionId: string) {
    const questionAttachments = this.items.filter(
      item => item.questionId.toString() !== questionId
    );

    this.items = questionAttachments;
  }
}
