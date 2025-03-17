import { AnswerAttachment } from '../../enterprise/entities/answer-attachement';

export abstract class AnswerAttachmentrepository {
  abstract createMany(attachments: AnswerAttachment[]): Promise<void>;
  abstract deleteMany(attachments: AnswerAttachment[]): Promise<void>;
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
  abstract deleteManyAnswerById(answerId: string): Promise<void>;
}
