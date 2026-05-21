import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGerbongDto {
  @ApiProperty({ example: 'Gerbong A' })
  @IsString()
  @IsNotEmpty()
  nama_gerbong: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  kuota: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  id_kereta: number;
}
