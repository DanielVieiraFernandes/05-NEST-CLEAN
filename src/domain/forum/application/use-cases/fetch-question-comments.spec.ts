import { MakeQuestionComment } from 'test/factories/make-question-comment';
import { MakeStudent } from 'test/factories/make-student';
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments';

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch question comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(
      inMemoryStudentsRepository
    );
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository); // system under test
  });

  it('Should be able to fetch question comments', async () => {
    const student = MakeStudent({
      name: 'John Doe',
    });

    inMemoryStudentsRepository.items.push(student);

    const comment1 = MakeQuestionComment({
      questionId: new UniqueEntityID('question-01'),
      authorId: student.id,
    });
    const comment2 = MakeQuestionComment({
      questionId: new UniqueEntityID('question-01'),
      authorId: student.id,
    });
    const comment3 = MakeQuestionComment({
      questionId: new UniqueEntityID('question-01'),
      authorId: student.id,
    });

    await inMemoryQuestionCommentRepository.create(comment1);
    await inMemoryQuestionCommentRepository.create(comment2);
    await inMemoryQuestionCommentRepository.create(comment3);

    const result = await sut.execute({
      questionId: 'question-01',
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment3.id,
        }),
      ])
    );
  });

  it('Should be able to fetch paginated question comments', async () => {
    const student = MakeStudent({
      name: 'John Doe',
    });

    inMemoryStudentsRepository.items.push(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentRepository.create(
        MakeQuestionComment({
          questionId: new UniqueEntityID('question-01'),
          authorId: student.id,
        })
      );
    }

    const result = await sut.execute({ page: 2, questionId: 'question-01' });

    expect(result.value?.comments).toHaveLength(2);
  });
});
