import { Test, TestingModule } from '@nestjs/testing';
import { MediaUtilsService } from './media-utils.service';

describe('MediaUtilsService', () => {
  let service: MediaUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediaUtilsService],
    }).compile();

    service = module.get<MediaUtilsService>(MediaUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be return result is defined', async () => {
    const result = await service.getVideoInfo(
      'test/resources/video-test-1.3gp',
    );
    expect(result).toBeDefined();
  });

  it('should be return duration is 5', async () => {
    const result = await service.getVideoInfo(
      'test/resources/video-test-1.3gp',
    );
    expect(result.duration).toBe(5);
  });

  it('codecVideo should be h264', async () => {
    const result = await service.getVideoInfo(
      'test/resources/video-test-1.3gp',
    );
    expect(result.videoCodec).toBe('h264');
  });

  it('codecAudio should be aac', async () => {
    const result = await service.getVideoInfo(
      'test/resources/video-test-1.3gp',
    );
    expect(result.audioCodec).toBe('aac');
  });

  it('screenShots must be created', async () => {
    const videoInfo = await service.getVideoInfo(
      'test/resources/video-test-2.mp4',
    );
    const result = await service.getScreenshot(
      Math.floor(videoInfo.duration / 2).toString(),
      'test/resources/video-test-2.mp4',
    );
    expect(result).toStrictEqual('1.jpg');
  });
});
