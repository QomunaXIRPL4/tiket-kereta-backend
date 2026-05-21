import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateJadwalDto {
  @ApiProperty({ example: 'Surabaya' })
  @IsString()
  @IsNotEmpty()
  asal_keberangkatan: string;

  @ApiProperty({ example: 'Jakarta' })
  @IsString()
  @IsNotEmpty()
  tujuan_keberangkatan: string;

  @ApiProperty({ example: '2025-06-01T08:00:00.000Z' })
  @IsDateString()
  tanggal_berangkat: string;

  @ApiProperty({ example: '2025-06-01T16:00:00.000Z' })
  @IsDateString()
  tanggal_kedatangan: string;

  @ApiProperty({ example: 350000 })
  @IsNumber()
  harga: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  id_kereta: number;
}
