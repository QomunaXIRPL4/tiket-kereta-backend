import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePetugasDto {
  @ApiProperty({ example: 'Budi Santoso' })
  @IsString()
  @IsNotEmpty()
  nama_petugas: string;

  @ApiProperty({ example: 'Jl. Merdeka No.1 Malang', required: false })
  @IsString()
  @IsOptional()
  alamat?: string;

  @ApiProperty({ example: '08123456789', required: false })
  @IsString()
  @IsOptional()
  telp?: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  id_user: number;
}
