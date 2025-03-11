import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionComment } from '../../enterprise/entities/question-comment';

export abstract class QuestionCommentsRepository {
  abstract create(questionComment: QuestionComment): Promise<void>;
  abstract delete(questionComment: QuestionComment): Promise<void>;
  abstract findById(id: string): Promise<QuestionComment | null>;
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]>;
}
