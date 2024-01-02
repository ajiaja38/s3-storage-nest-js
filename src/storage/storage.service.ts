import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, unlinkSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class StorageService {
  client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('accesskey'),
        secretAccessKey: this.configService.get<string>('secretkey'),
      },
      region: 'idn',
      endpoint: `https://${this.configService.get<string>('endpoint')}`,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    try {
      const fileExtension = file.originalname.substring(
        file.originalname.lastIndexOf('.'),
      );
      const fileName = `REPORT-${Date.now()}-${Math.floor(
        Math.random() * 10000,
      )}${fileExtension}`;

      const Bucket = this.configService.get<string>('bucket');
      const Key = `data/kehadiran/image/${fileName}`;
      const bodyStream = createReadStream(file.path);

      const command = new PutObjectCommand({
        Bucket,
        Key,
        Body: bodyStream,
        ContentEncoding: 'base64',
        ContentType: file.mimetype,
      });

      await this.client.send(command);

      return `https://${Bucket}.nos.wjv-1.neo.id/${Key}`;
    } catch (error) {
      throw new InternalServerErrorException(`Error: ${error.message}`);
    } finally {
      const filePath = resolve(__dirname, `../../public/${file.filename}`);
      unlinkSync(filePath);
    }
  }
}
