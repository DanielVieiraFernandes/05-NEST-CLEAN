import { MakeAttachment } from 'test/factories/make-attachment';
import { makeQuestion as MakeQuestion } from 'test/factories/make-question';
import { MakeQuestionAttachment } from 'test/factories/make-question-attachment';
import { MakeStudent } from 'test/factories/make-student';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryAttachmentRepository: InMemoryAttachmentsRepository;
let inMemoryStudentRepository: InMemoryStudentsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryAttachmentRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentRepository = new InMemoryStudentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentRepository,
      inMemoryStudentRepository
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository); // system under test
  });

  it('create an a question', async () => {
    const student = MakeStudent({ name: 'John Doe' });

    inMemoryStudentRepository.items.push(student);

    const newQuestion = MakeQuestion({
      authorId: student.id,
      slug: Slug.create('example-question'),
    });

    console.log(newQuestion);

    await inMemoryQuestionsRepository.create(newQuestion);

    const attachment = MakeAttachment({
      title: 'Some attachment',
    });

    inMemoryAttachmentRepository.items.push(attachment);

    inMemoryQuestionAttachmentRepository.items.push(
      MakeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      })
    );

    const result = await sut.execute({
      slug: 'example-question',
    });

    if (result.isLeft()) {
      return null;
    }

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: attachment.title,
          }),
        ],
      }),
    });
  });
});
