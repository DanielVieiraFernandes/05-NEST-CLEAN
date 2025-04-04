import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { QuestionDetails } from "../../enterprise/entities/value-objects/question-details";

interface GetQuestionBySlugUseCaseRequest {
    slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<ResourceNotFoundError,  {
    question: QuestionDetails;
}>

// DRY - Don't repeat yourself
/**
 * não quer dizer que você não possa repetir código
 * mas é importante analisar as circunstâncias e avaliar até onde é possível essa implementação
 * se é escalável
 * se não vai precisar separar responsabilidades dentro da aplicação
 * ...
 */
@Injectable()
export class GetQuestionBySlugUseCase {
    constructor(private questionRepository: QuestionsRepository){}

    async execute({slug}:GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse>{
        const question = await this.questionRepository.findDetailsBySlug(slug)

        if(!question){
            return left(new ResourceNotFoundError());
        }

        return right({question});
    }
}