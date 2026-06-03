import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PelangganService } from './pelanggan.service';
import { CreatePelangganDto } from './dto/create-pelanggan.dto';
import { UpdatePelangganDto } from './dto/update-pelanggan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Pelanggan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pelanggan')
export class PelangganController {
  constructor(private readonly pelangganService: PelangganService) {}

  // Pelanggan isi profil sendiri (tidak perlu id_user di body)
  @Post('profil')
  @Roles('penumpang')
  @ApiOperation({ summary: 'Pelanggan mengisi data profil sendiri' })
  createProfil(@Body() dto: CreatePelangganDto, @Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.pelangganService.createProfil(dto, req.user.userId);
  }

  // Pelanggan lihat profil sendiri
  @Get('profil')
  @Roles('penumpang')
  @ApiOperation({ summary: 'Pelanggan melihat profil sendiri' })
  getMyProfil(@Request() req) {
    return this.pelangganService.findByUserId(req.user.userId);
  }

  // Pelanggan update profil sendiri
  @Patch('profil')
  @Roles('penumpang')
  @ApiOperation({ summary: 'Pelanggan update profil sendiri' })
  updateMyProfil(@Body() dto: UpdatePelangganDto, @Request() req) {
    return this.pelangganService.updateByUserId(dto, req.user.userId);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Tambah pelanggan (Admin)' })
  create(@Body() dto: CreatePelangganDto) {
    return this.pelangganService.create(dto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Lihat semua pelanggan (Admin)' })
  findAll() {
    return this.pelangganService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Lihat detail pelanggan (Admin)' })
  findOne(@Param('id') id: string) {
    return this.pelangganService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update pelanggan (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdatePelangganDto) {
    return this.pelangganService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Hapus pelanggan (Admin)' })
  remove(@Param('id') id: string) {
    return this.pelangganService.remove(+id);
  }
}
