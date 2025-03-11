import { AnswerAttachment } from '../../enterprise/entities/answer-attachement';

export abstract class AnswerAttachmentrepository {
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
  abstract deleteManyAnswerById(answerId: string): Promise<void>;
}
