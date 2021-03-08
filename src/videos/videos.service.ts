import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { VideoInterface } from './interfaces/video.interface';
import { MediaUtilsService } from '../media-utils/media-utils.service';

@Injectable()
export class VideosService {
  constructor(
    private mediaUtilsService: MediaUtilsService,
    @InjectModel('videoFile')
    private readonly videoModels: Model<VideoInterface>,
  ) {}

  async create(file: Express.Multer.File) {
    const path = 'uploads/' + file.filename;
    const videoInfo = await this.mediaUtilsService.getVideoInfo(path);
    videoInfo.name = file.filename;
    videoInfo.screenshot = await this.mediaUtilsService.getScreenshot(
      Math.floor(videoInfo.duration).toString(),
      path,
    );
    const createdVideo = new this.videoModels(videoInfo);
    return createdVideo.save();
  }
}
