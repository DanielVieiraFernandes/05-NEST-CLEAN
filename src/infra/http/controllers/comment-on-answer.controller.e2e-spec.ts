import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Comment on answer (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let studentFactory: StudentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    studentFactory = moduleRef.get(StudentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /answers/:answerId/comments', async () => {
    const user = await studentFactory.makePrismaStudent();

    const access_token = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    });

    const answerId = answer.id.toString();

    const response = await request(app.getHttpServer())
      .post(`/answers/${answerId}/comments`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        content: 'New comment',
      });

    expect(response.statusCode).toBe(201);

    const commentOnDatabase = await prisma.comment.findFirst({
      where: {
        content: 'New comment',
      },
    });

    expect(commentOnDatabase).toBeTruthy();
  });
});
