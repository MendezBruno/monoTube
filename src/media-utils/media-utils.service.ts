import { Injectable } from '@nestjs/common';
import * as FfmpegCommand from 'fluent-ffmpeg';
import { VideoInfo } from './models/videoInfo';

@Injectable()
export class MediaUtilsService {
  getVideoInfo(inputPath: string): Promise<VideoInfo> {
    return new Promise((resolve, reject) => {
      return FfmpegCommand.ffprobe(inputPath, (error, metadata) => {
        if (error) {
          return reject(error);
        }
        const videoInfo = new VideoInfo();
        metadata.streams.forEach((stream) => {
          if (stream.codec_type === 'video')
            videoInfo.videoCodec = stream.codec_name;
          else if (stream.codec_type === 'audio')
            videoInfo.audioCodec = stream.codec_name;
        });
        videoInfo.duration = Math.floor(metadata.format.duration);

        return resolve(videoInfo);
      });
    });
  }

  getScreenshot(timeSecond: string, inputPath: string, filename: string) {
    const FIRST = 0;
    let thumbnailName: string;
    return new Promise<string>((resolve, reject) => {
      return FfmpegCommand(inputPath)
        .on('filenames', (filenames) => {
          thumbnailName = filename;
        })
        .on('end', () => {
          resolve(thumbnailName[FIRST]);
        })
        .on('error', (err) => {
          reject(err);
        })
        .screenshots({
          count: 1,
          filename: filename + '_%i.jpg',
          folder: 'uploads/thumbnail',
          timemarks: [timeSecond],
        });
    });
  }
}
