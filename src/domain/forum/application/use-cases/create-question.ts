import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { QuestionAttachment } from '../../enterprise/entities/question-attachement';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import { QuestionsRepository } from '../repositories/questions-repository';

interface CreateQuestionUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question;
  }
>;
// DRY - Don't repeat yourself
/**
 * não quer dizer que você não possa repetir código
 * mas é importante analisar as circunstâncias e avaliar até onde é possível essa implementação
 * se é escalável
 * se não vai precisar separar responsabilidades dentro da aplicação
 * ...
 */

@Injectable()
export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionsRepository) {}

  async execute({
    authorId,
    content,
    title,
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      content,
      title,
    });

    const questionAttachments = attachmentsIds.map(attachmentId => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      });
    });

    question.attachment = new QuestionAttachmentList(questionAttachments);

    await this.questionRepository.create(question);

    return right({ question });
  }
}
