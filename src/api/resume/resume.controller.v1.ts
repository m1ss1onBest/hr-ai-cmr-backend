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
import { UploadFileResponse } from './dto/upload-filel.dto';
import { CandidateIdDto } from '../candidates/dto/candidate-id-param.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller({
  version: '1',
  path: 'resume',
})
export class ResumeControllerV1 {
  constructor(
    private readonly uploadFilelUseCase: IUploadFileUsesCase,
    private readonly downloadFileUseCase: IDownloadFileUseCase,
  ) {}

  @Post('upload/:id')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload candidate resume',
    description: 'Uploads a candidate resume for specific candidate ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Candidate UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: UploadFileResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Candidate `UUID` not found',
  })
  @ApiBody({
    description: 'Resume file upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadCandidateResume(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ): Promise<UploadFileResponse> {
    return await this.uploadFilelUseCase.run({ file, id });
  }

  @Get('download/:candidateId')
  @ApiOperation({
    summary: 'Download candidate resume',
    description: 'Downloads the uploaded CV file for a candidate.',
  })
  @ApiParam({
    name: 'candidateId',
    type: String,
    description: 'Candidate UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'File stream returned successfully',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async downloadCandidateFile(
    @Param() params: CandidateIdDto,
    @Res() res: Response,
  ) {
    const { candidateId } = params;

    const { file: fileStream, filename } =
      await this.downloadFileUseCase.run(candidateId);

    res.set({
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': 'application/octet-stream',
    });

    fileStream.pipe(res);
  }
}
