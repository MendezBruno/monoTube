import { Module } from '@nestjs/common';
import { MediaUtilsService } from './media-utils.service';

@Module({
  providers: [MediaUtilsService]
})
export class MediaUtilsModule {}
