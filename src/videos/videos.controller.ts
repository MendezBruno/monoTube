import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus, Param,
  Post,
  Req,
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
import * as fs from 'fs';
import { VideoDto } from './dto/video.dto';

@ApiTags('video')
@Controller('videos')
export class VideosController {
  constructor(private videosService: VideosService) {}

  @Post('/upload')
  @ApiConsumes('multipart/form-data')
  @ApiFile('gallery')
  @UseInterceptors(FileInterceptor('gallery', localOptionMulter))
  @ApiOperation({ summary: 'upload a video' })
  @ApiResponse({ status: 201, description: 'video create' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async upload(@Res() res, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      res.status(400).send({
        status: false,
        data: 'No file is selected.',
      });
    }
    const result = await this.videosService.create(file);
    return res.status(HttpStatus.OK).json({
      status: 200,
      message: 'Image uploaded successfully!',
      data: result,
    });
  }

  @Post('/uploads')
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile('gallery')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'gallery', maxCount: 5 }],
      localOptionMulter,
    ),
  )
  @ApiOperation({ summary: 'upload several videos' })
  @ApiResponse({ status: 201, description: 'videos create' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async uploads(@Res() res, @UploadedFiles() files) {
    if (!files) {
      res.status(400).send({
        status: false,
        data: 'No files is selected.',
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'Image uploaded successfully!',
      data: files,
    });
  }

  @Get('/:videoName')
  public async getVideo(@Req() req, @Res() res, @Param() param) {
    const path = 'uploads/' + param.videoName;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(path, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
    }
  }
}
