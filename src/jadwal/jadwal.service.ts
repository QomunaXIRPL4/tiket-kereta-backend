import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJadwalDto } from './dto/create-jadwal.dto';
import { UpdateJadwalDto } from './dto/update-jadwal.dto';

@Injectable()
export class JadwalService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateJadwalDto) {
    return this.prisma.jadwal.create({
      data: {
        ...dto,
        tanggal_berangkat: new Date(dto.tanggal_berangkat),
        tanggal_kedatangan: new Date(dto.tanggal_kedatangan),
      },
    });
  }

  async findAll() {
    return this.prisma.jadwal.findMany({
      include: { kereta: true },
    });
  }

  async findOne(id: number) {
    const jadwal = await this.prisma.jadwal.findUnique({
      where: { id },
      include: {
        kereta: { include: { gerbong: { include: { kursi: true } } } },
      },
    });
    if (!jadwal) throw new NotFoundException('Jadwal tidak ditemukan');
    return jadwal;
  }

  async update(id: number, dto: UpdateJadwalDto) {
    await this.findOne(id);
    return this.prisma.jadwal.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.tanggal_berangkat && {
          tanggal_berangkat: new Date(dto.tanggal_berangkat),
        }),
        ...(dto.tanggal_kedatangan && {
          tanggal_kedatangan: new Date(dto.tanggal_kedatangan),
        }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.jadwal.delete({ where: { id } });
  }
}
