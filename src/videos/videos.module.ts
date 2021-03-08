import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from './schema/videos.schema';
import { MediaUtilsModule } from '../media-utils/media-utils.module';
import { MediaUtilsService } from '../media-utils/media-utils.service';

@Module({
  imports: [
    MediaUtilsModule,
    MongooseModule.forFeature([{ name: 'videoFile', schema: VideoSchema }]),
  ],
  controllers: [VideosController],
  providers: [VideosService, MediaUtilsService],
})
export class VideosModule {}
