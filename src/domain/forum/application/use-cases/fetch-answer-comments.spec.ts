import { MakeAnswer } from 'test/factories/make-answer';
import { MakeAnswerComment } from 'test/factories/make-answer-comment';
import { MakeStudent } from 'test/factories/make-student';
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch answer comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudentsRepository
    );
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository); // system under test
  });

  it('Should be able to fetch answer comments', async () => {
    const student = MakeStudent({
      name: 'John Doe',
    });

    inMemoryStudentsRepository.items.push(student);

    const comment1 = MakeAnswerComment({
      answerId: new UniqueEntityID('answer-01'),
      authorId: student.id,
    });
    const comment2 = MakeAnswerComment({
      answerId: new UniqueEntityID('answer-01'),
      authorId: student.id,
    });
    const comment3 = MakeAnswerComment({
      answerId: new UniqueEntityID('answer-01'),
      authorId: student.id,
    });

    await inMemoryAnswerCommentRepository.create(comment1);
    await inMemoryAnswerCommentRepository.create(comment2);
    await inMemoryAnswerCommentRepository.create(comment3);

    const result = await sut.execute({
      answerId: 'answer-01',
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(3);
  });

  it('Should be able to fetch paginated answer comments', async () => {

    const student = MakeStudent({
        name: 'John Doe',
      });
  
      inMemoryStudentsRepository.items.push(student);
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentRepository.create(
        MakeAnswerComment({
          answerId: new UniqueEntityID('answer-01'),
          authorId: student.id
        })
      );
    }

    const result = await sut.execute({ page: 2, answerId: 'answer-01' });

    expect(result.value?.comments).toHaveLength(2);
  });
});
