import { Attachment } from "../../enterprise/entities/attachement";

export abstract class AttachmentsRepository {
    abstract create(attachment: Attachment): Promise<void>
}