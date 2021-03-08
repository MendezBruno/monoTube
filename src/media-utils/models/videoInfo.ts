export class VideoInfo {
  size: number;
  duration: number;
  videoCodec: string;
  audioCodec: string;
  screenshot: string;
  name: string;

  constructor(size?, duration?) {
    this.size = size;
    this.duration = duration;
  }
}
