import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
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

  @Get('/')
  @ApiResponse({ status: 206, description: 'range head write' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  public async getAllVideo(@Res() res) {
    const result = await this.videosService.getAllVideos().catch((err) => {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: 403,
        message: 'Error when get videos' + err,
        data: result,
      });
    });
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Delete('/:id')
  @ApiResponse({ status: 200, description: 'delete ok' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  public async deleteVideo(@Res() res, @Param() param) {
    const result = await this.videosService.delete(param.id);
    console.log(result);
    try {
      fs.unlinkSync('upload/' + result.name);
      fs.unlinkSync('upload/thumbnail/' + result.screenshots);
    } catch (e) {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: 403,
        message: 'Error when get videos' + e,
        data: result,
      });
    }

    return res.status(HttpStatus.OK).json(result);
  }

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
    return res.status(HttpStatus.CREATED).json({
      status: 201,
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
      res.status(403).send({
        status: 403,
        data: 'No files is selected.',
      });
    }
    const result = [];
    files.gallery.forEach(async (file) => {
      const createResult = await this.videosService.create(file);
      result.push(createResult);
    });
    return res.status(HttpStatus.CREATED).json({
      status: 201,
      message: 'Image uploaded successfully!',
      data: result,
    });
  }

  @Get('/:videoName')
  @ApiResponse({ status: 206, description: 'range head write' })
  @ApiResponse({ status: 200, description: 'Ok.' })
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

  @Get('/thumbnail/:thumbnail')
  @ApiResponse({ status: 200, description: 'Ok.' })
  public async getThumbnail(@Req() req, @Res() res, @Param() param) {
    const path = 'uploads/thumbnail/' + param.thumbnail;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'image/jpg',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
}
