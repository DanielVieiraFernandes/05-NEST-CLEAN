import { QuestionAttachment } from '../../enterprise/entities/question-attachement';

export abstract class QuestionAttachmentrepository {
  abstract findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]>;
  abstract deleteManyQuestionById(questionId: string): Promise<void>;
}
