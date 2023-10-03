import { Test, TestingModule } from '@nestjs/testing';
import { GroupRequestsService } from './group-requests.service';

describe('GroupRequestsService', () => {
  let service: GroupRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupRequestsService],
    }).compile();

    service = module.get<GroupRequestsService>(GroupRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
