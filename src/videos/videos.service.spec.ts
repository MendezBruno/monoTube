import { Test, TestingModule } from '@nestjs/testing';
import { VideosService } from './videos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from './schema/videos.schema';

describe('VideosService', () => {
  let service: VideosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: 'videoFile', schema: VideoSchema }]),
        MongooseModule.forRoot('mongodb://localhost/camonapp')
      ],
      providers: [VideosService],
    }).compile();

    service = module.get<VideosService>(VideosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});
