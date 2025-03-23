import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { MakeAnswer } from 'test/factories/make-answer';
import { MakeAnswerAttachment } from 'test/factories/make-answer-attachment';
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachements-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import { EditAnswerUseCase } from './edit-answer';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sut: EditAnswerUseCase;

describe('Delete answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository
    );
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentRepository
    ); // system under test
  });

  it('should be able to edit a answer', async () => {
    const newAnswer = MakeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1')
    );

    console.log(newAnswer);

    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachmentRepository.items.push(
      MakeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      MakeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      })
    );

    await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: 'author-1',
      content: 'Conteúdo-teste',
      attachmentsIds: ['1', '3'],
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'Conteúdo-teste',
    });

    expect(
      inMemoryAnswersRepository.items[0].attachment.currentItems
    ).toHaveLength(2);
    expect(inMemoryAnswersRepository.items[0].attachment.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('3'),
      }),
    ]);
  });

  it('should not be able to delete a answer from another user', async () => {
    const newAnswer = MakeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1')
    );

    console.log(newAnswer);

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: 'author-2',
      content: 'Conteúdo-teste',
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should sync new and removed attachment when editing an answer', async () => {
    const newAnswer = MakeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1')
    );

    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachmentRepository.items.push(
      MakeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      MakeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      })
    );

    const result = await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: 'author-1',
      content: 'Conteúdo teste',
      attachmentsIds: ['1', '3'],
    });

    expect(result.isRight()).toBe(true);
    console.log(inMemoryAnswerAttachmentRepository.items);
    expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(2);
    console.log(`Array contendo: ${inMemoryAnswerAttachmentRepository.items}`)
    expect(inMemoryAnswerAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('3'),
        }),
      ])
    );
  });
});
