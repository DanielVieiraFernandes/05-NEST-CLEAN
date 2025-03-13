import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { AnswerCommentFactory } from 'test/factories/make-answer-comment';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionCommentFactory } from 'test/factories/make-question-comment';
import { StudentFactory } from 'test/factories/make-student';

describe('Delete answer comment (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let answerCommentFactory: AnswerCommentFactory;
  let questionCommentFactory: QuestionCommentFactory;
  let studentFactory: StudentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        QuestionCommentFactory,
        AnswerCommentFactory,
        AnswerFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    questionFactory = moduleRef.get(QuestionFactory);
    questionCommentFactory = moduleRef.get(QuestionCommentFactory);
    answerCommentFactory = moduleRef.get(AnswerCommentFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    studentFactory = moduleRef.get(StudentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[DELETE /answers/comments/:id', async () => {
    const user = await studentFactory.makePrismaStudent();

    const access_token = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: user.id
    })

    const answerComment = await answerCommentFactory.makePrismaAnswerComment({
        answerId: answer.id,
        authorId: user.id
    });


    const answerCommentId = answerComment.id.toString();

    const response = await request(app.getHttpServer())
      .delete(`/answers/comments/${answerCommentId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send();

    expect(response.statusCode).toBe(204);

    const commentOnDatabase = await prisma.comment.findUnique({
      where: {
        id: answerCommentId,
      },
    });

    expect(commentOnDatabase).toBeNull();
  });
});
