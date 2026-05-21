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
import { PetugasService } from './petugas.service';
import { CreatePetugasDto } from './dto/create-petugas.dto';
import { UpdatePetugasDto } from './dto/update-petugas.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Petugas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('petugas')
export class PetugasController {
  constructor(private readonly petugasService: PetugasService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Tambah petugas (Admin)' })
  create(@Body() dto: CreatePetugasDto) {
    return this.petugasService.create(dto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Lihat semua petugas (Admin)' })
  findAll() {
    return this.petugasService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Lihat detail petugas (Admin)' })
  findOne(@Param('id') id: string) {
    return this.petugasService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update petugas (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdatePetugasDto) {
    return this.petugasService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Hapus petugas (Admin)' })
  remove(@Param('id') id: string) {
    return this.petugasService.remove(+id);
  }
}
