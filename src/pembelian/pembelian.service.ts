import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePembelianDto } from './dto/create-pembelian.dto';

@Injectable()
export class PembelianService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePembelianDto, userId: number) {
    // 1. Cek jadwal ada
    const jadwal = await this.prisma.jadwal.findUnique({
      where: { id: dto.id_jadwal },
      include: {
        kereta: {
          include: {
            gerbong: { include: { kursi: true } },
          },
        },
      },
    });
    if (!jadwal) throw new NotFoundException('Jadwal tidak ditemukan');

    // 2. Cek pelanggan dari user yang login
    const pelanggan = await this.prisma.pelanggan.findUnique({
      where: { id_user: userId },
    });
    if (!pelanggan)
      throw new NotFoundException(
        'Data pelanggan tidak ditemukan. Silakan lengkapi profil pelanggan terlebih dahulu',
      );

    // 3. Cek semua kursi yang diminta tersedia (belum dipesan di jadwal ini)
    const kursiIds = dto.penumpang.map((p) => p.id_kursi);

    // Cek duplikat kursi dalam request
    const duplikat = kursiIds.filter(
      (id, index) => kursiIds.indexOf(id) !== index,
    );
    if (duplikat.length > 0) {
      throw new BadRequestException(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Kursi dengan id ${duplikat} dipilih lebih dari sekali`,
      );
    }

    // Cek kursi sudah dipesan di jadwal ini
    const kursiSudahDipesan = await this.prisma.detailPembelian.findMany({
      where: {
        id_kursi: { in: kursiIds },
        pembelian_tiket: { id_jadwal: dto.id_jadwal },
      },
    });

    if (kursiSudahDipesan.length > 0) {
      const idSudahDipesan = kursiSudahDipesan.map((k) => k.id_kursi);
      throw new BadRequestException(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Kursi dengan id ${idSudahDipesan} sudah dipesan`,
      );
    }

    // 4. Cek kuota gerbong masih cukup
    for (const penumpang of dto.penumpang) {
      const kursi = await this.prisma.kursi.findUnique({
        where: { id: penumpang.id_kursi },
        include: { gerbong: true },
      });
      if (!kursi)
        throw new NotFoundException(
          `Kursi id ${penumpang.id_kursi} tidak ditemukan`,
        );

      // Hitung kursi terpakai di gerbong ini untuk jadwal ini
      const kursiTerpakai = await this.prisma.detailPembelian.count({
        where: {
          kursi: { id_gerbong: kursi.id_gerbong },
          pembelian_tiket: { id_jadwal: dto.id_jadwal },
        },
      });

      // Tambah yang sedang dipesan dari request ini (kursi di gerbong yang sama)
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      const kursiDiGerbongSama = dto.penumpang.filter(async (p) => {
        const k = await this.prisma.kursi.findUnique({
          where: { id: p.id_kursi },
        });
        return k?.id_gerbong === kursi.id_gerbong;
      }).length;

      if (kursiTerpakai + kursiDiGerbongSama > kursi.gerbong.kuota) {
        throw new BadRequestException(
          `Kuota gerbong untuk kursi ${kursi.no_kursi} sudah penuh`,
        );
      }
    }

    // 5. Buat transaksi pembelian (atomic)
    const pembelian = await this.prisma.$transaction(async (tx) => {
      // Buat pembelian tiket utama
      const tiket = await tx.pembelianTiket.create({
        data: {
          id_pelanggan: pelanggan.id,
          id_jadwal: dto.id_jadwal,
        },
      });

      // Buat detail untuk setiap penumpang
      const details = await Promise.all(
        dto.penumpang.map((p) =>
          tx.detailPembelian.create({
            data: {
              NIK: p.NIK,
              nama_penumpang: p.nama_penumpang,
              id_kursi: p.id_kursi,
              id_pembelian_tiket: tiket.id,
            },
          }),
        ),
      );

      return { tiket, details };
    });

    // 6. Return data lengkap
    return this.findOne(pembelian.tiket.id);
  }

  async findAll() {
    return this.prisma.pembelianTiket.findMany({
      include: {
        pelanggan: true,
        jadwal: { include: { kereta: true } },
        detail_pembelian: {
          include: { kursi: { include: { gerbong: true } } },
        },
      },
      orderBy: { tanggal_pembelian: 'desc' },
    });
  }

  async findOne(id: number) {
    const pembelian = await this.prisma.pembelianTiket.findUnique({
      where: { id },
      include: {
        pelanggan: true,
        jadwal: { include: { kereta: true } },
        detail_pembelian: {
          include: { kursi: { include: { gerbong: true } } },
        },
      },
    });
    if (!pembelian)
      throw new NotFoundException('Data pembelian tidak ditemukan');
    return pembelian;
  }

  // Histori pembelian milik pelanggan yang login
  async findMyHistory(userId: number) {
    const pelanggan = await this.prisma.pelanggan.findUnique({
      where: { id_user: userId },
    });
    if (!pelanggan)
      throw new NotFoundException('Data pelanggan tidak ditemukan');

    return this.prisma.pembelianTiket.findMany({
      where: { id_pelanggan: pelanggan.id },
      include: {
        jadwal: { include: { kereta: true } },
        detail_pembelian: {
          include: { kursi: { include: { gerbong: true } } },
        },
      },
      orderBy: { tanggal_pembelian: 'desc' },
    });
  }

  // Histori per tanggal (untuk pelanggan)
  async findHistoryByTanggal(userId: number, tanggal: string) {
    const pelanggan = await this.prisma.pelanggan.findUnique({
      where: { id_user: userId },
    });
    if (!pelanggan)
      throw new NotFoundException('Data pelanggan tidak ditemukan');

    const startDate = new Date(tanggal);
    const endDate = new Date(tanggal);
    endDate.setDate(endDate.getDate() + 1);

    return this.prisma.pembelianTiket.findMany({
      where: {
        id_pelanggan: pelanggan.id,
        tanggal_pembelian: { gte: startDate, lt: endDate },
      },
      include: {
        jadwal: { include: { kereta: true } },
        detail_pembelian: { include: { kursi: true } },
      },
    });
  }

  // Histori per bulan (untuk pelanggan)
  async findHistoryByBulan(userId: number, tahun: number, bulan: number) {
    const pelanggan = await this.prisma.pelanggan.findUnique({
      where: { id_user: userId },
    });
    if (!pelanggan)
      throw new NotFoundException('Data pelanggan tidak ditemukan');

    const startDate = new Date(tahun, bulan - 1, 1);
    const endDate = new Date(tahun, bulan, 1);

    return this.prisma.pembelianTiket.findMany({
      where: {
        id_pelanggan: pelanggan.id,
        tanggal_pembelian: { gte: startDate, lt: endDate },
      },
      include: {
        jadwal: { include: { kereta: true } },
        detail_pembelian: { include: { kursi: true } },
      },
    });
  }

  // ===== PETUGAS/ADMIN =====

  // Semua transaksi by tanggal (admin)
  async findAllByTanggal(tanggal: string) {
    const startDate = new Date(tanggal);
    const endDate = new Date(tanggal);
    endDate.setDate(endDate.getDate() + 1);

    return this.prisma.pembelianTiket.findMany({
      where: {
        tanggal_pembelian: { gte: startDate, lt: endDate },
      },
      include: {
        pelanggan: true,
        jadwal: { include: { kereta: true } },
        detail_pembelian: { include: { kursi: true } },
      },
    });
  }

  // Semua transaksi by bulan (admin)
  async findAllByBulan(tahun: number, bulan: number) {
    const startDate = new Date(tahun, bulan - 1, 1);
    const endDate = new Date(tahun, bulan, 1);

    return this.prisma.pembelianTiket.findMany({
      where: {
        tanggal_pembelian: { gte: startDate, lt: endDate },
      },
      include: {
        pelanggan: true,
        jadwal: { include: { kereta: true } },
        detail_pembelian: { include: { kursi: true } },
      },
    });
  }

  // Rekap pemasukan per bulan (admin)
  async rekapPemasukanPerBulan(tahun: number, bulan: number) {
    const startDate = new Date(tahun, bulan - 1, 1);
    const endDate = new Date(tahun, bulan, 1);

    const transaksi = await this.prisma.pembelianTiket.findMany({
      where: {
        tanggal_pembelian: { gte: startDate, lt: endDate },
      },
      include: {
        jadwal: true,
        detail_pembelian: true,
      },
    });

    // Hitung total pemasukan
    let totalPemasukan = 0;
    let totalTiket = 0;

    transaksi.forEach((t) => {
      const jumlahPenumpang = t.detail_pembelian.length;
      totalTiket += jumlahPenumpang;
      totalPemasukan += t.jadwal.harga * jumlahPenumpang;
    });

    return {
      periode: `${bulan}/${tahun}`,
      total_transaksi: transaksi.length,
      total_tiket_terjual: totalTiket,
      total_pemasukan: totalPemasukan,
      detail_transaksi: transaksi,
    };
  }

  // Nota/bukti pembelian
  async getNota(id: number, userId: number) {
    const pembelian = await this.prisma.pembelianTiket.findUnique({
      where: { id },
      include: {
        pelanggan: { include: { user: { select: { username: true } } } },
        jadwal: { include: { kereta: true } },
        detail_pembelian: {
          include: { kursi: { include: { gerbong: true } } },
        },
      },
    });

    if (!pembelian)
      throw new NotFoundException('Data pembelian tidak ditemukan');

    const pelanggan = await this.prisma.pelanggan.findUnique({
      where: { id_user: userId },
    });

    // Pastikan hanya pemilik tiket atau admin yang bisa lihat nota
    if (pelanggan && pembelian.id_pelanggan !== pelanggan.id) {
      throw new BadRequestException('Anda tidak memiliki akses ke nota ini');
    }

    const jumlahPenumpang = pembelian.detail_pembelian.length;
    const totalHarga = pembelian.jadwal.harga * jumlahPenumpang;

    return {
      nota: {
        id_pembelian: pembelian.id,
        tanggal_pembelian: pembelian.tanggal_pembelian,
        pelanggan: pembelian.pelanggan.nama_penumpang,
        kereta: pembelian.jadwal.kereta.nama_kereta,
        kelas: pembelian.jadwal.kereta.kelas,
        asal: pembelian.jadwal.asal_keberangkatan,
        tujuan: pembelian.jadwal.tujuan_keberangkatan,
        tanggal_berangkat: pembelian.jadwal.tanggal_berangkat,
        tanggal_kedatangan: pembelian.jadwal.tanggal_kedatangan,
        harga_per_tiket: pembelian.jadwal.harga,
        jumlah_penumpang: jumlahPenumpang,
        total_harga: totalHarga,
        penumpang: pembelian.detail_pembelian.map((d) => ({
          nama: d.nama_penumpang,
          NIK: d.NIK,
          kursi: d.kursi.no_kursi,
          gerbong: d.kursi.gerbong.nama_gerbong,
        })),
      },
    };
  }
}
