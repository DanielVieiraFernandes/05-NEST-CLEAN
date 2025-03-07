import { Either, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { QuestionsRepository } from "../repositories/questions-repository";
import { Injectable } from "@nestjs/common";

interface FetchRecentQuestionsUseCaseRequest {
    page: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<null, {
    questions: Question[];
}
>
// DRY - Don't repeat yourself
/**
 * não quer dizer que você não possa repetir código
 * mas é importante analisar as circunstâncias e avaliar até onde é possível essa implementação
 * se é escalável
 * se não vai precisar separar responsabilidades dentro da aplicação
 * ...
 */
@Injectable()
export class FetchRecentQuestionsUseCase {
    constructor(private questionRepository: QuestionsRepository){}

    async execute({page}:FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse>{
        const questions = await this.questionRepository.findManyRecent({page});

       
        return right({questions})
    }
}