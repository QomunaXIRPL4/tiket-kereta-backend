import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';

export class DetailPenumpangDto {
  @ApiProperty({ example: '3578123456789001' })
  @IsString()
  @IsNotEmpty()
  NIK: string;

  @ApiProperty({ example: 'Ahmad Fauzi' })
  @IsString()
  @IsNotEmpty()
  nama_penumpang: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  id_kursi: number;
}

export class CreatePembelianDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id_jadwal: number;

  @ApiProperty({
    type: [DetailPenumpangDto],
    example: [
      { NIK: '3578123456789001', nama_penumpang: 'Ahmad Fauzi', id_kursi: 1 },
      { NIK: '3578123456789002', nama_penumpang: 'Siti Rahma', id_kursi: 2 },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DetailPenumpangDto)
  penumpang: DetailPenumpangDto[];
}
