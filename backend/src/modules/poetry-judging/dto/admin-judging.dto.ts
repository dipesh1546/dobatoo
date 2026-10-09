import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CompetitionStatus, ReviewStatus } from '@prisma/client';

export class CreateJudgeDto {
  @ApiProperty({ example: 'Dr. Maya Sharma', description: 'Judge full name' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'judge.maya@dobato.app', description: 'Judge email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'JudgePass@2026', description: 'Judge initial password' })
  @IsString()
  @MaxLength(100)
  password: string;
}

export class UpdateJudgeDto {
  @ApiPropertyOptional({ example: 'Dr. Maya Sharma' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'judge.maya@dobato.app' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'NewJudgePass@2026' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  password?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AssignJudgeDto {
  @ApiProperty({ example: '652c7f1a9b1e8a0012345678', description: 'Poetry participant ID' })
  @IsString()
  participantId: string;
}

export class CreateCriterionDto {
  @ApiProperty({ example: 'Originality & Creativity', description: 'Criterion name' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Evaluates unique voice and poetic technique' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 25, description: 'Weight percentage (total criteria weights must sum to 100)' })
  @IsNumber()
  @Min(0.1)
  @Max(100)
  weight: number;

  @ApiProperty({ example: 10, description: 'Maximum score possible' })
  @IsNumber()
  @Min(1)
  maxScore: number;

  @ApiPropertyOptional({ example: 1, description: 'Display order' })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number = 0;
}

export class UpdateCriterionDto {
  @ApiPropertyOptional({ example: 'Originality & Creativity' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Evaluates unique voice and poetic technique' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(100)
  weight?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxScore?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCompetitionStatusDto {
  @ApiProperty({ enum: CompetitionStatus, example: CompetitionStatus.JUDGING })
  @IsEnum(CompetitionStatus)
  status: CompetitionStatus;
}

export class ReviewEntryDto {
  @ApiProperty({ enum: ReviewStatus, example: ReviewStatus.REVIEWED })
  @IsEnum(ReviewStatus)
  reviewStatus: ReviewStatus;

  @ApiPropertyOptional({ example: 'Excellent composition, approved for judging.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reviewNote?: string;
}

export class SingleWinnerDto {
  @ApiProperty({ example: 1, description: 'Winner position: 1, 2, or 3' })
  @IsInt()
  @Min(1)
  @Max(3)
  position: number;

  @ApiProperty({ example: '652c7f1a9b1e8a0012345678', description: 'Winning poetry participant ID' })
  @IsString()
  participantId: string;
}

export class SelectWinnersDto {
  @ApiProperty({ type: [SingleWinnerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleWinnerDto)
  winners: SingleWinnerDto[];
}
