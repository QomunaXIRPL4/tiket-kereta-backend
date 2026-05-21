import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PembelianService } from './pembelian.service';
import { CreatePembelianDto } from './dto/create-pembelian.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Pembelian Tiket')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pembelian')
export class PembelianController {
  constructor(private readonly pembelianService: PembelianService) {}

  // ===== PELANGGAN =====
  @Post()
  @Roles('penumpang')
  @ApiOperation({
    summary: 'Pesan tiket kereta (Pelanggan) - bisa lebih dari 1 penumpang',
  })
  create(@Body() dto: CreatePembelianDto, @Request() req) {
    return this.pembelianService.create(dto, req.user.userId);
  }

  @Get('my-history')
  @Roles('penumpang')
  @ApiOperation({ summary: 'Lihat histori pembelian saya (Pelanggan)' })
  findMyHistory(@Request() req) {
    return this.pembelianService.findMyHistory(req.user.userId);
  }

  @Get('my-history/tanggal')
  @Roles('penumpang')
  @ApiOperation({ summary: 'Histori pembelian saya per tanggal (Pelanggan)' })
  @ApiQuery({ name: 'tanggal', example: '2025-06-01' })
  findMyHistoryByTanggal(@Request() req, @Query('tanggal') tanggal: string) {
    return this.pembelianService.findHistoryByTanggal(req.user.userId, tanggal);
  }

  @Get('my-history/bulan')
  @Roles('penumpang')
  @ApiOperation({ summary: 'Histori pembelian saya per bulan (Pelanggan)' })
  @ApiQuery({ name: 'tahun', example: '2025' })
  @ApiQuery({ name: 'bulan', example: '6' })
  findMyHistoryByBulan(
    @Request() req,
    @Query('tahun') tahun: string,
    @Query('bulan') bulan: string,
  ) {
    return this.pembelianService.findHistoryByBulan(
      req.user.userId,
      +tahun,
      +bulan,
    );
  }

  @Get('nota/:id')
  @ApiOperation({ summary: 'Cetak nota/bukti pembelian tiket' })
  getNota(@Param('id') id: string, @Request() req) {
    return this.pembelianService.getNota(+id, req.user.userId);
  }

  // ===== ADMIN/PETUGAS =====
  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Lihat semua transaksi (Admin)' })
  findAll() {
    return this.pembelianService.findAll();
  }

  @Get('admin/tanggal')
  @Roles('admin')
  @ApiOperation({ summary: 'Lihat transaksi by tanggal (Admin)' })
  @ApiQuery({ name: 'tanggal', example: '2025-06-01' })
  findAllByTanggal(@Query('tanggal') tanggal: string) {
    return this.pembelianService.findAllByTanggal(tanggal);
  }

  @Get('admin/bulan')
  @Roles('admin')
  @ApiOperation({ summary: 'Lihat transaksi by bulan (Admin)' })
  @ApiQuery({ name: 'tahun', example: '2025' })
  @ApiQuery({ name: 'bulan', example: '6' })
  findAllByBulan(@Query('tahun') tahun: string, @Query('bulan') bulan: string) {
    return this.pembelianService.findAllByBulan(+tahun, +bulan);
  }

  @Get('admin/rekap')
  @Roles('admin')
  @ApiOperation({ summary: 'Rekap pemasukan per bulan (Admin)' })
  @ApiQuery({ name: 'tahun', example: '2025' })
  @ApiQuery({ name: 'bulan', example: '6' })
  rekapPemasukan(@Query('tahun') tahun: string, @Query('bulan') bulan: string) {
    return this.pembelianService.rekapPemasukanPerBulan(+tahun, +bulan);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lihat detail pembelian by ID' })
  findOne(@Param('id') id: string) {
    return this.pembelianService.findOne(+id);
  }
}
