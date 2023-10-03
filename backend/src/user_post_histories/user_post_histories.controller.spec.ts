import { Test, TestingModule } from '@nestjs/testing';
import { UserPostHistoriesController } from './user_post_histories.controller';
import { UserPostHistoriesService } from './user_post_histories.service';

describe('UserPostHistoriesController', () => {
  let controller: UserPostHistoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPostHistoriesController],
      providers: [UserPostHistoriesService],
    }).compile();

    controller = module.get<UserPostHistoriesController>(UserPostHistoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
