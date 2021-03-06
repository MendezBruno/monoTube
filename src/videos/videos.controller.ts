import { Body, Controller, HttpStatus, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('video')
@Controller('videos')
export class VideosController {
  @Post('/upload')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'gallery', maxCount: 1 }]))
  @ApiOperation({ summary: 'upload a video' })
  @ApiResponse({ status: 201, description: 'survey response create' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async findAll(@UploadedFiles() files) {
    // const surveyResponse = await this.surveysResponseService.create(surveysResponseDto);
    // return res.status(HttpStatus.OK).json(surveyResponse);
  }
}
