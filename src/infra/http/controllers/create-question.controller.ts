import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth-guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema
  ) {
    const { content, title } = body;
    const { sub: userId } = user;

    await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    });
  }
}
