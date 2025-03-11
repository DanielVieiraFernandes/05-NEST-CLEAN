import {faker} from "@faker-js/faker"
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionComment, QuestionCommentProps } from "@/domain/forum/enterprise/entities/question-comment";
import { PrismaQuestionCommentMapper } from "@/infra/database/prisma/mappers/prisma-question-comment-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function MakeQuestionComment(override: Partial<QuestionCommentProps> = {}, id?: UniqueEntityID){
    const questionComment = QuestionComment.create({
        authorId: new UniqueEntityID(),
        questionId: new UniqueEntityID(),
        content: faker.lorem.text(),
        ...override
    }, id)

    return questionComment;
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionComment(
    data: Partial<QuestionCommentProps> = {},
  ): Promise<QuestionComment> {
    const questioncomment = MakeQuestionComment(data)

    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(questioncomment),
    })

    return questioncomment
  }
}