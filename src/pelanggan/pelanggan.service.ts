import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePelangganDto } from './dto/create-pelanggan.dto';
import { UpdatePelangganDto } from './dto/update-pelanggan.dto';

@Injectable()
export class PelangganService {
  constructor(private prisma: PrismaService) {}

  // Pelanggan isi profil sendiri
  async createProfil(dto: CreatePelangganDto, userId: number) {
    // Cek apakah sudah punya profil
    const existing = await this.prisma.pelanggan.findUnique({
      where: { id_user: userId },
    });
    if (existing) throw new ConflictException('Profil pelanggan sudah ada');

    // Cek NIK sudah dipakai orang lain
    const nikExist = await this.prisma.pelanggan.findUnique({
      where: { NIK: dto.NIK },
    });
    if (nikExist) throw new ConflictException('NIK sudah terdaftar');

    return this.prisma.pelanggan.create({
      data: {
        NIK: dto.NIK,
        nama_penumpang: dto.nama_penumpang,
        alamat: dto.alamat,
        telp: dto.telp,
        id_user: userId, // ambil dari token, bukan dari body
      },
      include: { user: { select: { username: true, role: true } } },
    });
  }

  // Pelanggan lihat profilnya sendiri
  async findByUserId(userId: number) {
    const pelanggan = await this.prisma.pelanggan.findUnique({
      where: { id_user: userId },
      include: { user: { select: { username: true, role: true } } },
    });
    if (!pelanggan) throw new NotFoundException('Profil pelanggan belum diisi');
    return pelanggan;
  }

  // Pelanggan update profilnya sendiri
  async updateByUserId(dto: UpdatePelangganDto, userId: number) {
    const pelanggan = await this.prisma.pelanggan.findUnique({
      where: { id_user: userId },
    });
    if (!pelanggan)
      throw new NotFoundException('Profil pelanggan tidak ditemukan');

    return this.prisma.pelanggan.update({
      where: { id: pelanggan.id },
      data: {
        ...(dto.NIK && { NIK: dto.NIK }),
        ...(dto.nama_penumpang && { nama_penumpang: dto.nama_penumpang }),
        ...(dto.alamat && { alamat: dto.alamat }),
        ...(dto.telp && { telp: dto.telp }),
      },
      include: { user: { select: { username: true, role: true } } },
    });
  }

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
