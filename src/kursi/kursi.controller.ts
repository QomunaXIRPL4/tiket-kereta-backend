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
import { KursiService } from './kursi.service';
import { CreateKursiDto } from './dto/create-kursi.dto';
import { UpdateKursiDto } from './dto/update-kursi.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Kursi')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('kursi')
export class KursiController {
  constructor(private readonly kursiService: KursiService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Tambah kursi (Admin)' })
  create(@Body() dto: CreateKursiDto) {
    return this.kursiService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lihat semua kursi' })
  findAll() {
    return this.kursiService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lihat detail kursi' })
  findOne(@Param('id') id: string) {
    return this.kursiService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update kursi (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateKursiDto) {
    return this.kursiService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Hapus kursi (Admin)' })
  remove(@Param('id') id: string) {
    return this.kursiService.remove(+id);
  }
}
