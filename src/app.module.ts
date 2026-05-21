import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PelangganModule } from './pelanggan/pelanggan.module';
import { PetugasModule } from './petugas/petugas.module';
import { KeretaModule } from './kereta/kereta.module';
import { GerbongModule } from './gerbong/gerbong.module';
import { KursiModule } from './kursi/kursi.module';
import { JadwalModule } from './jadwal/jadwal.module';
import { PembelianModule } from './pembelian/pembelian.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PelangganModule,
    PetugasModule,
    KeretaModule,
    GerbongModule,
    KursiModule,
    JadwalModule,
    PembelianModule,
  ],
})
export class AppModule {}
