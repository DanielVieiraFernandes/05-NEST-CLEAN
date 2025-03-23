import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { MakeAnswer } from "test/factories/make-answer";
import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comments-repository"; 
import { CommentOnAnswerUseCase } from "./comment-on-answer";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachements-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryStudentRepository: InMemoryStudentsRepository;
let sut: CommentOnAnswerUseCase;

describe('Comment on Answer', () => {

    beforeEach(() => {
        inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository);
        inMemoryStudentRepository = new InMemoryStudentsRepository();
        inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentRepository(inMemoryStudentRepository);
        sut = new CommentOnAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerCommentsRepository);
    })

    it('should be able to comment on answer', async () => {

        const answer = MakeAnswer();

        await inMemoryAnswersRepository.create(answer);

        await sut.execute({
            answerId: answer.id.toString(),
            authorId: answer.authorId.toString(),
            content: 'Comentário teste'
        })

        expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual('Comentário teste')
    })

})
