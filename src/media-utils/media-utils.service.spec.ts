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

  it('should be return size and duration', async () => {
    const result = await service.getVideoInfo(
      'test/resources/video-test-1.3gp',
    );
    console.log(result);
    expect(result).toBeDefined();
  });
});
