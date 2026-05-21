import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePelangganDto {
  @ApiProperty({ example: '3578123456789001' })
  @IsString()
  @IsNotEmpty()
  NIK: string;

  @ApiProperty({ example: 'Ahmad Fauzi' })
  @IsString()
  @IsNotEmpty()
  nama_penumpang: string;

  @ApiProperty({ example: 'Jl. Raya Sidoarjo No.5', required: false })
  @IsString()
  @IsOptional()
  alamat?: string;

  @ApiProperty({ example: '08129876543', required: false })
  @IsString()
  @IsOptional()
  telp?: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  id_user: number;
}
