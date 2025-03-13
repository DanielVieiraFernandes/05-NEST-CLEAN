import { randomUUID } from 'node:crypto';
import {
  UploadParams,
  Uploader,
} from '@/domain/forum/application/storage/uploader';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { EnvService } from '../env/env.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client;

  constructor(private envService: EnvService) {
    const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID');

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async upload({
    body,
    fileName,
    fileType,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID();

    const uniqueFileName = `${uploadId}-${fileName}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      })
    );

    return {
      url: uniqueFileName,
    };
  }
}
