import { Test, TestingModule } from '@nestjs/testing';
import { GroupRequestsController } from './group-requests.controller';
import { GroupRequestsService } from './group-requests.service';

describe('GroupRequestsController', () => {
  let controller: GroupRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupRequestsController],
      providers: [GroupRequestsService],
    }).compile();

    controller = module.get<GroupRequestsController>(GroupRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
