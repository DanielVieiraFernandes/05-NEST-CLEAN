import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion as MakeQuestion } from "test/factories/make-question";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryAttachmentRepository: InMemoryAttachmentsRepository;
let inMemoryStudentRepository: InMemoryStudentsRepository;
let sut: FetchRecentQuestionsUseCase;

describe('Fetch Recent questions', () => {

    beforeEach(() => {
        inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
        inMemoryAttachmentRepository = new InMemoryAttachmentsRepository();
            inMemoryStudentRepository = new InMemoryStudentsRepository();
            inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
              inMemoryQuestionAttachmentRepository,
              inMemoryAttachmentRepository,
              inMemoryStudentRepository
            );
        sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository) // system under test
    })

    it('Should be able to fetch recent questions', async () => {

        await inMemoryQuestionsRepository.create(MakeQuestion({createdAt: new Date(2022, 0, 20)}))
        await inMemoryQuestionsRepository.create(MakeQuestion({createdAt: new Date(2022, 0, 18)}))
        await inMemoryQuestionsRepository.create(MakeQuestion({createdAt: new Date(2022, 0, 23)}))

        const result = await sut.execute({page: 1})

        expect(result.value?.questions).toEqual([
            expect.objectContaining({
                createdAt: new Date(2022, 0, 23)
            }),
            expect.objectContaining({
                createdAt: new Date(2022, 0, 20)
            }),
            expect.objectContaining({
                createdAt: new Date(2022, 0, 18)
            })
        ])
    })

    it('Should be able to fetch paginated recent questions', async () => {

        for (let i = 1; i <= 22; i++){
            await inMemoryQuestionsRepository.create(MakeQuestion())
        }

        const result = await sut.execute({page: 2})

        expect(result.value?.questions).toHaveLength(2);
    })
})
