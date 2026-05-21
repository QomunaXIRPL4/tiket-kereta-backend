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
import { KeretaService } from './kereta.service';
import { CreateKeretaDto } from './dto/create-kereta.dto';
import { UpdateKeretaDto } from './dto/update-kereta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Kereta')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('kereta')
export class KeretaController {
  constructor(private readonly keretaService: KeretaService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Tambah kereta (Admin)' })
  create(@Body() dto: CreateKeretaDto) {
    return this.keretaService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lihat semua kereta' })
  findAll() {
    return this.keretaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lihat detail kereta' })
  findOne(@Param('id') id: string) {
    return this.keretaService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update kereta (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateKeretaDto) {
    return this.keretaService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Hapus kereta (Admin)' })
  remove(@Param('id') id: string) {
    return this.keretaService.remove(+id);
  }
}
