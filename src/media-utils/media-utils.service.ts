import { Injectable } from '@nestjs/common';
import * as FfmpegCommand from 'fluent-ffmpeg';

@Injectable()
export class MediaUtilsService {
  getVideoInfo(inputPath: string) {
    return new Promise((resolve, reject) => {
      return FfmpegCommand.ffprobe(inputPath, (error, videoInfo) => {
        if (error) {
          return reject(error);
        }

        const { duration, size } = videoInfo.format;

        return resolve({
          size,
          durationInSeconds: Math.floor(duration),
        });
      });
    });
  }
}
