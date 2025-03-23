import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository';
import { InMemoryQuestionAttachmentRepository } from './in-memory-question-attachments-repository';
import { InMemoryStudentsRepository } from './in-memory-students-repository';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentRepository,
    private attachmentRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository
  ) {}

  public items: Question[] = [];

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async create(question: Question): Promise<void> {
    this.items.push(question);

    await this.questionAttachmentsRepository.createMany(
      question.attachment.getItems()
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string) {
    const question = this.items.find(item => item.slug.value === slug);

    if (!question) {
      return null;
    }

    return question;
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find(item => item.slug.value === slug);

    if (!question) {
      return null;
    }

    const author = this.studentsRepository.items.find(student => {
      return student.id.equals(question.authorId);
    });

    if (!author) {
      throw new Error(
        `Author with ID ${question.authorId.toString()} does not exist`
      );
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      questionAttchment => {
        return questionAttchment.questionId.equals(question.id);
      }
    );

    const attachments = questionAttachments.map(questionAttachment => {
      const attachment = this.attachmentRepository.items.find(attachment => {
        return attachment.id.equals(questionAttachment.attachmentId);
      });

      if (!attachment) {
        throw new Error(`Attachment with ID does not exist`);
      }

      return attachment;
    });

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      attachments,
    });
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex(item => item.id === question.id);

    this.items.splice(itemIndex, 1);

    this.questionAttachmentsRepository.deleteManyQuestionById(
      question.id.toString()
    );
  }

  async findById(id: string) {
    const question = this.items.find(item => item.id.toString() === id);

    if (!question) {
      return null;
    }

    return question;
  }
  async save(question: Question) {
    console.log('Question do save: ', question);

    const itemIndex = this.items.findIndex(item => item.id === question.id);

    this.items[itemIndex] = question;

    await this.questionAttachmentsRepository.deleteMany(
      question.attachment.getRemovedItems()
    );

    await this.questionAttachmentsRepository.createMany(
      question.attachment.getNewItems()
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }
}
