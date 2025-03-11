import { QuestionAttachmentrepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachement";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionAttachmentMapper } from "../mappers/prisma-question-attachment-mapper";

@Injectable()
export class PrismaQuestionsAttachmentsRepository implements QuestionAttachmentrepository {

    constructor(private prisma: PrismaService) {}
        
    async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
        const questionAttachments = await this.prisma.attachement.findMany({
            where:{
                questionId
            }
        })

        return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain)
    }
    async deleteManyQuestionById(questionId: string): Promise<void> {
       await this.prisma.attachement.deleteMany({
        where:{
            questionId
        }
       })
    }
}