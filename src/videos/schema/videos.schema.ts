import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type VideoDocument = Video & Document;

@Schema()
export class Video {
  @Prop()
  name: string;

  @Prop()
  audioCodec: string;

  @Prop()
  duration: number;

  @Prop()
  videoCodec: string;

  @Prop()
  screenshot: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
