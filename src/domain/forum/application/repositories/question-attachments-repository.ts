import { QuestionAttachment } from '../../enterprise/entities/question-attachement';

export abstract class QuestionAttachmentrepository {
  abstract createMany(attachments: QuestionAttachment[]): Promise<void>;
  abstract deleteMany(attachments: QuestionAttachment[]): Promise<void>;
  abstract findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]>;
  abstract deleteManyQuestionById(questionId: string): Promise<void>;
}
