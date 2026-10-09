import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class AdminCreateJudgeDto {
  @ApiProperty({ example: 'Dr. Binod Pandey', description: 'Judge full name' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @ApiProperty({ example: 'binod@dobato.app', description: 'Judge email address' })
  @IsEmail({}, { message: 'A valid email address is required' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email: string;

  @ApiPropertyOptional({ example: '+9779841234567', description: 'Judge phone number' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  phone?: string;

  @ApiPropertyOptional({
    example: 'JudgeSecret@2026',
    description: 'Initial password (min 8 chars). If omitted, a secure temporary password will be auto-generated.',
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password?: string;
}

export class AdminUpdateJudgeDto {
  @ApiPropertyOptional({ example: 'Dr. Binod Pandey' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;

  @ApiPropertyOptional({ example: 'binod.updated@dobato.app' })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email?: string;

  @ApiPropertyOptional({ example: '+9779841234567' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  phone?: string;

  @ApiPropertyOptional({ example: 'NewJudgePass@2026' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AdminUpdateJudgeStatusDto {
  @ApiProperty({ example: true, description: 'Active status of the judge' })
  @IsBoolean()
  isActive: boolean;
}

export class AssignJudgeToPoetryDto {
  @ApiProperty({ example: '67a7...judgeId', description: 'Judge MongoDB ObjectId' })
  @IsString()
  @IsNotEmpty({ message: 'Judge ID is required' })
  judgeId: string;
}
