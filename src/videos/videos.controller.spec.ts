import { Test, TestingModule } from '@nestjs/testing';
import { VideosController } from './videos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from './schema/videos.schema';
import { VideosService } from './videos.service';

describe('VideosController', () => {
  let controller: VideosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: 'videoFile', schema: VideoSchema }]),
        MongooseModule.forRoot('mongodb://localhost/camonapp'),
      ],
      controllers: [VideosController],
      providers: [VideosService],
    }).compile();

    controller = module.get<VideosController>(VideosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
