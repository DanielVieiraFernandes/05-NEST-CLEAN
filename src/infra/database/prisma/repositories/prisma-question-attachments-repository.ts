import { QuestionAttachmentrepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachement";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaQuestionsAttachmentsRepository implements QuestionAttachmentrepository {
    findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
        throw new Error("Method not implemented.");
    }
    deleteManyQuestionById(questionId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}