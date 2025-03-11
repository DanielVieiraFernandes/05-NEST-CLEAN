import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
    BadRequestException, Controller,
    Delete,
    HttpCode,
    Param,
    Patch
} from '@nestjs/common';

@Controller('/answers/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerController {
  constructor(private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string
  ) {
    const { sub: userId } = user;

    const result = await this.chooseQuestionBestAnswer.execute({
      answerId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
