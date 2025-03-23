import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { MakeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentRepository;
let inMemoryStudentRepository: InMemoryStudentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe('Delete question comment', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentsRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentRepository(
      inMemoryStudentRepository
    );
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it('should be able to delete a question comment', async () => {
    const questionComment = MakeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(questionComment);

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it('should be able to delete a question comment', async () => {
    const questionComment = MakeQuestionComment({
      authorId: new UniqueEntityID('author-1'),
    });

    await inMemoryQuestionCommentsRepository.create(questionComment);

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'author-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
