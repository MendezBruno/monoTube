import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { VideoInterface } from './interfaces/video.interface';

@Injectable()
export class VideosService {

  constructor(
    @InjectModel('videoFile') private readonly videoModels: Model<VideoInterface>) {}

  async create(file: Express.Multer.File) {
    // todo extrac codec
    const createdVideo = new this.videoModels(file);
    return createdVideo.save();
  }
}
