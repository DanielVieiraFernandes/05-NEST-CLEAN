import {faker} from "@faker-js/faker"
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerComment, AnswerCommentProps } from "@/domain/forum/enterprise/entities/answer-comment";
import { PrismaAnswerCommentMapper } from "@/infra/database/prisma/mappers/prisma-answer-comment-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function MakeAnswerComment(override: Partial<AnswerCommentProps> = {}, id?: UniqueEntityID){
    const answerComment = AnswerComment.create({
        authorId: new UniqueEntityID(),
        answerId: new UniqueEntityID(),
        content: faker.lorem.text(),
        ...override
    }, id)

    return answerComment;
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerComment(
    data: Partial<AnswerCommentProps> = {},
  ): Promise<AnswerComment> {
    const answercomment = MakeAnswerComment(data)

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(answercomment),
    })

    return answercomment
  }
}