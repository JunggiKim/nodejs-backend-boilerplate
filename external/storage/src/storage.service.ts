import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private s3Client!: S3Client;
  private defaultBucket!: string;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const region = this.configService.get<string>('AWS_REGION', 'ap-northeast-2');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID', 'placeholder');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY', 'placeholder');
    this.defaultBucket = this.configService.get<string>('AWS_S3_BUCKET', 'my-bucket');

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.logger.log(`S3 client initialized in region ${region}`);
  }

  async upload(key: string, file: Buffer, contentType?: string): Promise<string> {
    this.logger.log(`Uploading file ${key} to S3 bucket ${this.defaultBucket}`);
    const command = new PutObjectCommand({
      Bucket: this.defaultBucket,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await this.s3Client.send(command);
    return `https://${this.defaultBucket}.s3.amazonaws.com/${key}`;
  }
}
