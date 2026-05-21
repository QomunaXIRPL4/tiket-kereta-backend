import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  kursi: any;
    detailPembelian: any;
    pelanggan: any;
    jadwal: any;
  $transaction(arg0: (tx: any) => Promise<{ tiket: any; details: any[]; }>) {
      throw new Error('Method not implemented.');
  }
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }
}
