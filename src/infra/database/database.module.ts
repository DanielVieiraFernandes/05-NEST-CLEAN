import { AnswerAttachmentrepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository';
import { AnswerRepository } from '@/domain/forum/application/repositories/answers-repository';
import { QuestionAttachmentrepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answers-attachments-repository';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answers-comments-repository';
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answers-repository';
import { PrismaQuestionsAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository';
import { PrismaQuestionsCommentsRepository } from './prisma/repositories/prisma-questions-comments-repository';
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository';
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionsCommentsRepository,
    },
    {
      provide: QuestionAttachmentrepository,
      useClass: PrismaQuestionsAttachmentsRepository,
    },
    { provide: AnswerRepository, useClass: PrismaAnswerRepository },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AnswerAttachmentrepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    StudentsRepository,
    QuestionCommentsRepository,
    QuestionAttachmentrepository,
    AnswerRepository,
    AnswerCommentsRepository,
    AnswerAttachmentrepository,
  ],
})
export class DatabaseModule {}
