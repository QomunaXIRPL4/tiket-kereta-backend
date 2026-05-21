import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateKursiDto {
  @ApiProperty({ example: '1A' })
  @IsString()
  @IsNotEmpty()
  no_kursi: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  id_gerbong: number;
}
