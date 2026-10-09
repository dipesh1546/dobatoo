import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  ParticipationType,
  RegistrationStatus,
  PoetryLanguage,
  PerformanceType,
} from '@prisma/client';

export class AdminRegistrationQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Search by registrationId, fullName, email, or phone',
    example: 'dipesh',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  search?: string;

  @ApiPropertyOptional({ enum: ParticipationType })
  @IsOptional()
  @Transform(({ value }) => (!value || value === 'ALL' ? undefined : value))
  @IsEnum(ParticipationType)
  participationType?: ParticipationType;

  @ApiPropertyOptional({ enum: ParticipationType, description: 'Alias for participationType' })
  @IsOptional()
  @Transform(({ value }) => (!value || value === 'ALL' ? undefined : value))
  @IsEnum(ParticipationType)
  participation?: ParticipationType;

  @ApiPropertyOptional({ enum: RegistrationStatus })
  @IsOptional()
  @Transform(({ value }) => (!value || value === 'ALL' ? undefined : value))
  @IsEnum(RegistrationStatus)
  status?: RegistrationStatus;

  @ApiPropertyOptional({ enum: PerformanceType })
  @IsOptional()
  @Transform(({ value }) => (!value || value === 'ALL' ? undefined : value))
  @IsEnum(PerformanceType)
  performanceType?: PerformanceType;

  @ApiPropertyOptional({
    description: 'Deprecated check-in filter kept for backward compatibility',
    example: 'PENDING',
  })
  @IsOptional()
  @IsString()
  checkInStatus?: 'CHECKED_IN' | 'PENDING';

  @ApiPropertyOptional({ example: '2026-10-01' })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional({ example: '2026-10-16' })
  @IsOptional()
  @IsString()
  toDate?: string;

  @ApiPropertyOptional({ example: 'ALL' })
  @IsOptional()
  @IsString()
  dateRange?: string;

  @ApiPropertyOptional({ example: '2026-10-01' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-10-16' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ example: 'createdAt', enum: ['createdAt', 'fullName', 'registrationId'] })
  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'fullName' | 'registrationId' = 'createdAt';

  @ApiPropertyOptional({ example: 'desc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class AdminPoetryQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Search by participant name, registration ID, or poetry title',
    example: 'Two Roads',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  search?: string;

  @ApiPropertyOptional({ enum: PoetryLanguage })
  @IsOptional()
  @Transform(({ value }) => (!value || value === 'ALL' ? undefined : value))
  @IsEnum(PoetryLanguage)
  language?: PoetryLanguage;

  @ApiPropertyOptional({ enum: PerformanceType })
  @IsOptional()
  @Transform(({ value }) => (!value || value === 'ALL' ? undefined : value))
  @IsEnum(PerformanceType)
  performanceType?: PerformanceType;

  @ApiPropertyOptional({ example: 'PENDING', enum: ['CHECKED_IN', 'PENDING'] })
  @IsOptional()
  @IsString()
  checkInStatus?: 'CHECKED_IN' | 'PENDING';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reviewStatus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  judgingStatus?: string;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 250 })
  total: number;

  @ApiProperty({ example: 13 })
  totalPages: number;
}
