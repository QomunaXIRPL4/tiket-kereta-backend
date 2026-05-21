import { Test, TestingModule } from '@nestjs/testing';
import { GerbongController } from './gerbong.controller';

describe('GerbongController', () => {
  let controller: GerbongController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GerbongController],
    }).compile();

    controller = module.get<GerbongController>(GerbongController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
