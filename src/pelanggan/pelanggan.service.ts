import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePelangganDto } from './dto/create-pelanggan.dto';
import { UpdatePelangganDto } from './dto/update-pelanggan.dto';

@Injectable()
export class PelangganService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePelangganDto) {
    return this.prisma.pelanggan.create({
      data: dto,
      include: { user: { select: { username: true, role: true } } },
    });
  }

  async findAll() {
    return this.prisma.pelanggan.findMany({
      include: { user: { select: { username: true, role: true } } },
    });
  }

  async findOne(id: number) {
    const pelanggan = await this.prisma.pelanggan.findUnique({
      where: { id },
      include: { user: { select: { username: true, role: true } } },
    });
    if (!pelanggan) throw new NotFoundException('Pelanggan tidak ditemukan');
    return pelanggan;
  }

  async update(id: number, dto: UpdatePelangganDto) {
    await this.findOne(id);
    return this.prisma.pelanggan.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.pelanggan.delete({ where: { id } });
  }
}
