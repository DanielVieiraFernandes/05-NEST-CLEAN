import { PaginationParams } from '@/core/repositories/pagination-params';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { Injectable } from '@nestjs/common';
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {

  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!student) {
      return null;
    }

    return PrismaStudentMapper.toDomain(student);
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student);

    await this.prisma.user.create({
      data,
    });
  }
  
}
