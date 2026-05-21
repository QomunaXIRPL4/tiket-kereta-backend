import { Test, TestingModule } from '@nestjs/testing';
import { PembelianService } from './pembelian.service';

describe('PembelianService', () => {
  let service: PembelianService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PembelianService],
    }).compile();

    service = module.get<PembelianService>(PembelianService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
