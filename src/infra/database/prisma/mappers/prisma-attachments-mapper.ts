import { Attachment } from '@/domain/forum/enterprise/entities/attachement';
import { Prisma } from '@prisma/client';

export class PrismaAttachmentMapper {
  static toPrisma(
    attachment: Attachment
  ): Prisma.AttachementUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    };
  }
}
