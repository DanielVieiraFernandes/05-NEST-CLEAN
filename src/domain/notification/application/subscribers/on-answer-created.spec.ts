import { MakeAnswer } from 'test/factories/make-answer';
import { makeQuestion as MakeQuestion } from 'test/factories/make-question';
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachements-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { waitFor } from 'test/utils/wait-for';
import { MockInstance } from 'vitest';
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification';
import { OnAnswerCreated } from './on-answer-created';

let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionsrepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswersAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest
  ) => Promise<SendNotificationUseCaseResponse>
>;

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionsrepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    );
    inMemoryAnswersAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentRepository
    );
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnAnswerCreated(inMemoryQuestionsrepository, sendNotificationUseCase);
  });

  it('should send a notification when an answer is created', async () => {
    const question = MakeQuestion();
    const answer = MakeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionsrepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
