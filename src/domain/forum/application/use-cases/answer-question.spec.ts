import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachements-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import { AnswerQuestionUseCase } from './answer-question';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sut: AnswerQuestionUseCase;

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository
    );
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository); // system under test
  });

  it('create an a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      content: 'Nova resposta',
      questionId: '1',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer);
    expect(
      inMemoryAnswersRepository.items[0].attachment.currentItems
    ).toHaveLength(2);
    expect(inMemoryAnswersRepository.items[0].attachment.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('2'),
      }),
    ]);
  });

  it('should persist attachments when creating a new answer', async () => {
      const result = await sut.execute({
        questionId: '1',
        authorId: '1',
        content: 'Conteúdo da resposta',
        attachmentsIds: ['1', '2'],
      })
  
      expect(result.isRight()).toBe(true)
      expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(2)
      expect(inMemoryAnswerAttachmentRepository.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            attachmentId: new UniqueEntityID('1'),
          }),
          expect.objectContaining({
            attachmentId: new UniqueEntityID('2'),
          }),
        ]),
      )
    })
});
