import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class JudgeLoginDto {
  @ApiProperty({ example: 'judge.maya@dobato.app', description: 'Judge email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'JudgePass@2026', description: 'Judge password' })
  @IsString()
  password: string;
}

export class SingleScoreDto {
  @ApiProperty({ example: '652c7f1a9b1e8a0012345678', description: 'Judging criterion ID' })
  @IsString()
  criterionId: string;

  @ApiProperty({ example: 8.5, description: 'Score awarded' })
  @IsNumber()
  @Min(0)
  score: number;

  @ApiPropertyOptional({ example: 'Strong poetic rhythm and emotional resonance.' })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class SubmitScoresDto {
  @ApiProperty({ type: [SingleScoreDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleScoreDto)
  scores: SingleScoreDto[];
}
