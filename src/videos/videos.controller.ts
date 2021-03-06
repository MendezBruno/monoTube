import {
  Body,
  Controller, HttpException,
  HttpStatus,
  Post, Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ApiFile, ApiMultiFile } from './videos.decorator';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utils/file-uploading.utils';

@ApiTags('video')
@Controller('videos')
export class VideosController {
  @Post('/upload')
  @ApiConsumes('multipart/form-data')
  @ApiFile('gallery')
  @UseInterceptors(
    FileInterceptor('gallery', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiOperation({ summary: 'upload a video' })
  @ApiResponse({ status: 201, description: 'survey response create' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async upload(@Res() res, @UploadedFile() file: Express.Multer.File) {
    console.log(file);
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Image uploaded successfully!',
      data: response,
    });
  }

  @Post('/uploads')
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile('gallery')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'gallery', maxCount: 2 }], {}),
  )
  @ApiOperation({ summary: 'upload several videos' })
  @ApiResponse({ status: 201, description: 'survey response create' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async uploads(@UploadedFiles() files) {
    console.log(files);
    // const surveyResponse = await this.surveysResponseService.create(surveysResponseDto);
    // return res.status(HttpStatus.OK).json(surveyResponse);
  }
}
