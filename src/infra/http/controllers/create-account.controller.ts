import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { Public } from '@/infra/auth/public';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
  BadRequestException,
  ConflictException,
  UsePipes,
} from '@nestjs/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { z } from 'zod';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body;

    const result = await this.registerStudent.execute({
      email,
      name,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { student } = result.value;

    return {
      student,
    };
  }
}
