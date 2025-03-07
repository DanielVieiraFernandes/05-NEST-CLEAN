import { AnswerAttachmentrepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachement";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentrepository {
    findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
        throw new Error("Method not implemented.");
    }
    deleteManyAnswerById(answerId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}