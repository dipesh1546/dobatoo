import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import {
  ParticipationType,
  PerformanceType,
  PoetryLanguage,
  DiscoverySource,
  RegistrationStatus,
} from '@prisma/client';

export class AdminCreateRegistrationDto {
  @ApiProperty({ example: 'Rohan Shrestha', description: 'Participant full name' })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  fullName: string;

  @ApiProperty({ example: 'rohan.shrestha@example.com', description: 'Participant email address' })
  @IsEmail({}, { message: 'A valid email address is required' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email: string;

  @ApiProperty({ example: '+9779841112233', description: 'Contact phone number' })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^(\+?977[- ]?)?[9][6-8]\d{8}$|^(\+?\d{1,4}[- ]?)?\d{7,14}$/, {
    message: 'Phone number must be a valid mobile or phone format (e.g. +97798XXXXXXXX)',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  phone: string;

  @ApiPropertyOptional({ example: 24 })
  @IsOptional()
  @IsInt()
  @Min(1)
  age?: number;

  @ApiPropertyOptional({ example: 'Kathmandu' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  city?: string;

  @ApiPropertyOptional({ example: 'MALE' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  gender?: string;

  @ApiPropertyOptional({
    enum: ParticipationType,
    default: ParticipationType.ATTEND_ONLY,
    description: 'Participation option',
  })
  @IsOptional()
  @IsEnum(ParticipationType)
  participationType?: ParticipationType = ParticipationType.ATTEND_ONLY;

  @ApiPropertyOptional({
    description: 'How participant would like to be introduced on stage',
    example: 'Rohan S.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  stageIntroductionName?: string;

  @ApiPropertyOptional({
    description: 'Alias for stageIntroductionName',
    example: 'Rohan S.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  stageName?: string;

  @ApiPropertyOptional({
    enum: PerformanceType,
    default: PerformanceType.POETRY,
    description: 'Type of open mic performance',
  })
  @IsOptional()
  @IsEnum(PerformanceType)
  performanceType?: PerformanceType;

  @ApiPropertyOptional({
    description: 'Title of the poetry or performance piece',
    example: 'A Crossroads Tale',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  poetryTitle?: string;

  @ApiPropertyOptional({
    description: 'Official poetry topic. Must be DOBATO.',
    default: 'DOBATO',
    example: 'DOBATO',
  })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional({
    enum: PoetryLanguage,
    default: PoetryLanguage.NEPALI,
  })
  @IsOptional()
  @IsEnum(PoetryLanguage)
  poetryLanguage?: PoetryLanguage;

  @ApiPropertyOptional({
    description: 'Overview or summary of performance',
    example: 'An original open mic composition.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  description?: string;

  @ApiPropertyOptional({
    enum: DiscoverySource,
    default: DiscoverySource.FRIENDS,
  })
  @IsOptional()
  @IsEnum(DiscoverySource)
  discoverySource?: DiscoverySource;

  @ApiPropertyOptional({ example: 'ADMIN_MANUAL' })
  @IsOptional()
  @IsString()
  source?: string;
}

export class AdminUpdateRegistrationDto {
  @ApiPropertyOptional({ example: 'Rohan Shrestha' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  fullName?: string;

  @ApiPropertyOptional({ example: 'rohan.new@example.com' })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email?: string;

  @ApiPropertyOptional({ example: '+9779841112233' })
  @IsOptional()
  @IsString()
  @Matches(/^(\+?977[- ]?)?[9][6-8]\d{8}$|^(\+?\d{1,4}[- ]?)?\d{7,14}$/, {
    message: 'Phone number must be a valid mobile or phone format',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  phone?: string;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsInt()
  @Min(1)
  age?: number;

  @ApiPropertyOptional({ example: 'Lalitpur' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  city?: string;

  @ApiPropertyOptional({ example: 'MALE' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ enum: ParticipationType })
  @IsOptional()
  @IsEnum(ParticipationType)
  participationType?: ParticipationType;

  @ApiPropertyOptional({ enum: RegistrationStatus })
  @IsOptional()
  @IsEnum(RegistrationStatus)
  status?: RegistrationStatus;

  @ApiPropertyOptional({ example: 'DJ Rohan' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  stageIntroductionName?: string;

  @ApiPropertyOptional({ example: 'DJ Rohan' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  stageName?: string;

  @ApiPropertyOptional({ example: 'Whispers of Dobato' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  poetryTitle?: string;

  @ApiPropertyOptional({ enum: PerformanceType })
  @IsOptional()
  @IsEnum(PerformanceType)
  performanceType?: PerformanceType;

  @ApiPropertyOptional({ enum: PoetryLanguage })
  @IsOptional()
  @IsEnum(PoetryLanguage)
  poetryLanguage?: PoetryLanguage;

  @ApiPropertyOptional({ example: 'Updated performance notes.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  description?: string;
}
