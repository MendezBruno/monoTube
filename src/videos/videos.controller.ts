import {
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
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
import { localOptionMulter } from '../utils/file-uploading.utils';
import { VideosService } from './videos.service';

@ApiTags('video')
@Controller('videos')
export class VideosController {
  constructor(private videosService: VideosService) {}


  @Post('/upload')
  @ApiConsumes('multipart/form-data')
  @ApiFile('gallery')
  @UseInterceptors(FileInterceptor('gallery', localOptionMulter))
  @ApiOperation({ summary: 'upload a video' })
  @ApiResponse({ status: 201, description: 'survey response create' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async upload(@Res() res, @UploadedFile() file: Express.Multer.File) {
    console.log(file);
    try {
      const result = await this.videosService.create(file);
    } catch (e) {

    }
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return res.status(HttpStatus.OK).json({
      message: 'Image uploaded successfully!',
      data: response,
    });
  }

  @Post('/uploads')
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile('gallery')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'gallery', maxCount: 2 }],
      localOptionMulter,
    ),
  )
  @ApiOperation({ summary: 'upload several videos' })
  @ApiResponse({ status: 201, description: 'survey response create' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async uploads(@Res() res, @UploadedFiles() files) {
    console.log(files);
    return res.status(HttpStatus.OK).json({
      message: 'Image uploaded successfully!',
      data: files,
    });
  }
}
