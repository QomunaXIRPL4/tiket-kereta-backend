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
import { GerbongService } from './gerbong.service';
import { CreateGerbongDto } from './dto/create-gerbong.dto';
import { UpdateGerbongDto } from './dto/update-gerbong.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Gerbong')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('gerbong')
export class GerbongController {
  constructor(private readonly gerbongService: GerbongService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Tambah gerbong (Admin)' })
  create(@Body() dto: CreateGerbongDto) {
    return this.gerbongService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lihat semua gerbong' })
  findAll() {
    return this.gerbongService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lihat detail gerbong' })
  findOne(@Param('id') id: string) {
    return this.gerbongService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update gerbong (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateGerbongDto) {
    return this.gerbongService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Hapus gerbong (Admin)' })
  remove(@Param('id') id: string) {
    return this.gerbongService.remove(+id);
  }
}
