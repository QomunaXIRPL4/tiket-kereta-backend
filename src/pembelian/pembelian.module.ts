import { Module } from '@nestjs/common';
import { PembelianService } from './pembelian.service';
import { PembelianController } from './pembelian.controller';

@Module({
  controllers: [PembelianController],
  providers: [PembelianService],
})
export class PembelianModule {}
