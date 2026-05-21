import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JadwalService } from './jadwal.service';
import { CreateJadwalDto } from './dto/create-jadwal.dto';
import { UpdateJadwalDto } from './dto/update-jadwal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Jadwal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('jadwal')
export class JadwalController {
  constructor(private readonly jadwalService: JadwalService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Tambah jadwal (Admin)' })
  create(@Body() dto: CreateJadwalDto) {
    return this.jadwalService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lihat semua jadwal' })
  findAll() {
    return this.jadwalService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lihat detail jadwal beserta kursi tersedia' })
  findOne(@Param('id') id: string) {
    return this.jadwalService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update jadwal (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateJadwalDto) {
    return this.jadwalService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Hapus jadwal (Admin)' })
  remove(@Param('id') id: string) {
    return this.jadwalService.remove(+id);
  }
}
