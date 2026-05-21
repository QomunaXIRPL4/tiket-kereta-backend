import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKeretaDto } from './dto/create-kereta.dto';
import { UpdateKeretaDto } from './dto/update-kereta.dto';

@Injectable()
export class KeretaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateKeretaDto) {
    return this.prisma.kereta.create({ data: dto });
  }

  async findAll() {
    return this.prisma.kereta.findMany({
      include: { gerbong: true, jadwal: true },
    });
  }

  async findOne(id: number) {
    const kereta = await this.prisma.kereta.findUnique({
      where: { id },
      include: { gerbong: { include: { kursi: true } }, jadwal: true },
    });
    if (!kereta) throw new NotFoundException('Kereta tidak ditemukan');
    return kereta;
  }

  async update(id: number, dto: UpdateKeretaDto) {
    await this.findOne(id);
    return this.prisma.kereta.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.kereta.delete({ where: { id } });
  }
}
