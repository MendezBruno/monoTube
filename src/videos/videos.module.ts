import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from './schema/videos.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'videoFile', schema: VideoSchema }]),
  ],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
