import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateKeretaDto {
  @ApiProperty({ example: 'Argo Bromo Anggrek' })
  @IsString()
  @IsNotEmpty()
  nama_kereta: string;

  @ApiProperty({ example: 'Kereta eksekutif Jakarta-Surabaya' })
  @IsString()
  deskripsi: string;

  @ApiProperty({ example: 'Eksekutif' })
  @IsString()
  @IsNotEmpty()
  kelas: string;
}
