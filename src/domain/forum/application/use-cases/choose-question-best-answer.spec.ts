import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { MakeAnswer } from 'test/factories/make-answer';
import { makeQuestion as MakeQuestion } from 'test/factories/make-question';
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachements-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository;
let inMemoryAttachmentRepository: InMemoryAttachmentsRepository;
let inMemoryStudentRepository: InMemoryStudentsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository
    );
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryAttachmentRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentRepository = new InMemoryStudentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentRepository,
      inMemoryStudentRepository
    );
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository
    ); // system under test
  });

  it('should be able to choose the question best answer', async () => {
    const question = MakeQuestion();

    const answer = MakeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    const q = inMemoryQuestionsRepository.items[0];
    console.log('Question do teste: ', q);

    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(
      answer.id
    );
  });

  it('should not be able to choose another user question best', async () => {
    const question = MakeQuestion({
      authorId: new UniqueEntityID('author-1'),
    });

    const newAnswer = MakeAnswer({
      questionId: question.id,
    });

    await inMemoryAnswersRepository.create(newAnswer);
    await inMemoryQuestionsRepository.create(question);

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: newAnswer.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
