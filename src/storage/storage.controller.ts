import { Controller, HttpStatus, Post, UploadedFile } from '@nestjs/common';
import { StorageService } from './storage.service';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config';
import { resolve } from 'path';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', multerOptions(resolve(__dirname, '../../public'))),
  )
  async postFileHandler(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const url = await this.storageService.uploadFile(file);

    return {
      code: HttpStatus.CREATED,
      status: true,
      message: 'Berhasil mengupload file',
      data: url,
    };
  }
}
