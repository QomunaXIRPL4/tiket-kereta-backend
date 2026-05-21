import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetugasDto } from './dto/create-petugas.dto';
import { UpdatePetugasDto } from './dto/update-petugas.dto';

@Injectable()
export class PetugasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePetugasDto) {
    return this.prisma.petugas.create({
      data: dto,
      include: { user: { select: { username: true, role: true } } },
    });
  }

  async findAll() {
    return this.prisma.petugas.findMany({
      include: { user: { select: { username: true, role: true } } },
    });
  }

  async findOne(id: number) {
    const petugas = await this.prisma.petugas.findUnique({
      where: { id },
      include: { user: { select: { username: true, role: true } } },
    });
    if (!petugas) throw new NotFoundException('Petugas tidak ditemukan');
    return petugas;
  }

  async update(id: number, dto: UpdatePetugasDto) {
    await this.findOne(id);
    return this.prisma.petugas.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.petugas.delete({ where: { id } });
  }
}
