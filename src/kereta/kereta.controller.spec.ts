import { Test, TestingModule } from '@nestjs/testing';
import { KeretaController } from './kereta.controller';

describe('KeretaController', () => {
  let controller: KeretaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeretaController],
    }).compile();

    controller = module.get<KeretaController>(KeretaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
