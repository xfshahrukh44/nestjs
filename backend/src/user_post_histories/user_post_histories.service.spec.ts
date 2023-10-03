import { Test, TestingModule } from '@nestjs/testing';
import { UserPostHistoriesService } from './user_post_histories.service';

describe('UserPostHistoriesService', () => {
  let service: UserPostHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPostHistoriesService],
    }).compile();

    service = module.get<UserPostHistoriesService>(UserPostHistoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
