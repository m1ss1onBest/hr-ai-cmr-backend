import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IUploadFileUsesCase } from './use-cases/upload-file/upload-file.interface';
import { IDownloadFileUseCase } from './use-cases/download-file/download-file.interface';
import { Response } from 'express';

@Controller({
  version: '1',
  path: 'resume',
})
export class ResumeControllerV1 {
  constructor(
    private readonly uploadFilelUseCase: IUploadFileUsesCase,
    private readonly downloadFileUseCase: IDownloadFileUseCase,
  ) {}

  @Post('upload')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.uploadFilelUseCase.run(file);
  }

  @Get('download/:filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const fileStream = await this.downloadFileUseCase.run(filename);

    res.set({
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': 'application/octet-stream',
    });

    fileStream.pipe(res);
  }
}
