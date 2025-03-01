import { Body, Controller, Post, Req } from '@nestjs/common';
import { title } from 'process';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { TokenPayloadSchema } from 'src/auth/jwt.strategy';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Req() req: any,
    // @Body(new ZodValidationPipe(createQuestionBodySchema))
    // body: CreateQuestionBodySchema
  ) {
    // const { content, title } = body;
    // const { sub: userId } = req;

    console.log("=> o req aqui" + req.user);

    // await this.prisma.question.create({
    //   data: {
    //     title,
    //     content,
    //     slug: 'asd',
    //     authorId: userId
    //   },
    // });
  }
}
