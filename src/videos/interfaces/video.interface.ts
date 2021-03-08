import { Document } from 'mongoose';

export interface VideoInterface extends Document {
  readonly audioCodec: string;
  readonly videoCodec: string;
  readonly duration: number;
  readonly screenshots: string;
  readonly name: string;
}
