import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKursiDto } from './dto/create-kursi.dto';
import { UpdateKursiDto } from './dto/update-kursi.dto';

@Injectable()
export class KursiService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateKursiDto) {
    return this.prisma.kursi.create({ data: dto });
  }

  async findAll() {
    return this.prisma.kursi.findMany({
      include: { gerbong: true },
    });
  }

  async findOne(id: number) {
    const kursi = await this.prisma.kursi.findUnique({
      where: { id },
      include: { gerbong: { include: { kereta: true } } },
    });
    if (!kursi) throw new NotFoundException('Kursi tidak ditemukan');
    return kursi;
  }

  async update(id: number, dto: UpdateKursiDto) {
    await this.findOne(id);
    return this.prisma.kursi.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.kursi.delete({ where: { id } });
  }
}
