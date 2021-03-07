import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosModule } from './videos/videos.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { MediaUtilsModule } from './media-utils/media-utils.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './videos',
    }),
    VideosModule,
    MongooseModule.forRoot('mongodb://localhost/camonapp'),
    MediaUtilsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
