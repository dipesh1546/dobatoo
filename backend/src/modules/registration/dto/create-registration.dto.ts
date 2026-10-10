import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
  Equals,
} from 'class-validator';
import {
  ParticipationType,
  PoetryLanguage,
  PerformanceType,
  DiscoverySource,
} from '@prisma/client';

export class CreatePoetryDetailsDto {
  @ApiProperty({
    description: 'Title of the poetry piece or stage introduction name',
    example: 'Two Roads',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty({ message: 'Poetry title is required when participating in poetry' })
  @MaxLength(150, { message: 'Poetry title cannot exceed 150 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title: string;

  @ApiPropertyOptional({
    description: 'Language of the poetry performance (Deprecated/Optional)',
    enum: PoetryLanguage,
    example: PoetryLanguage.NEPALI,
  })
  @IsOptional()
  @IsEnum(PoetryLanguage)
  language?: PoetryLanguage;

  @ApiProperty({
    description: 'Style/Type of performance: POETRY, STORY_TELLING, MUSIC, OTHER',
    enum: PerformanceType,
    example: PerformanceType.POETRY,
  })
  @IsEnum(PerformanceType, {
    message: 'Performance type must be one of POETRY, STORY_TELLING, MUSIC, OTHER',
  })
  performanceType: PerformanceType;

  @ApiPropertyOptional({
    description: 'Poetry topic. The only accepted topic is DOBATO.',
    example: 'DOBATO',
    default: 'DOBATO',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  topic?: string;

  @ApiPropertyOptional({
    description: 'Brief overview or summary of the poetry/performance piece',
    example: 'A reflective poem exploring life choices and intersecting paths.',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  description?: string;
}

export class CreateRegistrationDto {
  @ApiProperty({
    description: 'Full legal or preferred name of the registrant',
    example: 'Anil Shrestha',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MaxLength(100, { message: 'Full name cannot exceed 100 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  fullName: string;

  @ApiProperty({
    description: 'Email address of the registrant',
    example: 'anil.shrestha@example.com',
  })
  @IsEmail({}, { message: 'A valid email address is required' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email: string;

  @ApiProperty({
    description: 'Nepal-compatible mobile or phone number',
    example: '+9779841234567',
  })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^(\+?977[- ]?)?[9][6-8]\d{8}$|^(\+?\d{1,4}[- ]?)?\d{7,15}$/, {
    message: 'Phone number must be a valid mobile or phone format (e.g. +97798XXXXXXXX or +97797XXXXXXXX)',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().replace(/[\s-]/g, '') : value))
  phone: string;

  @ApiPropertyOptional({
    description: 'Gender identity',
    example: 'MALE',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  gender?: string;

  @ApiProperty({
    description: 'Registration option: ATTEND_ONLY or ATTEND_AND_POETRY',
    enum: ParticipationType,
    example: ParticipationType.ATTEND_ONLY,
  })
  @IsEnum(ParticipationType, {
    message: 'Participation type must be ATTEND_ONLY or ATTEND_AND_POETRY',
  })
  participationType: ParticipationType;

  @ApiProperty({
    description: 'Where did you find out about this event?',
    enum: DiscoverySource,
    example: DiscoverySource.INSTAGRAM,
  })
  @IsEnum(DiscoverySource, {
    message: 'Discovery source must be INSTAGRAM, TIKTOK, FRIENDS, or OTHERS',
  })
  discoverySource: DiscoverySource;

  @ApiPropertyOptional({
    description: 'Specific details if discoverySource is OTHERS (Required if discoverySource=OTHERS)',
    example: 'Facebook Ad',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  discoverySourceOther?: string;

  @ApiPropertyOptional({
    description: 'How would you like to be introduced on stage? (Required if participating in performance/poetry)',
    example: 'DJ Anil',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  stageIntroductionName?: string;

  @ApiPropertyOptional({
    description: 'Type of performance: POETRY, STORY_TELLING, MUSIC, OTHER (Required if participating)',
    enum: PerformanceType,
    example: PerformanceType.POETRY,
  })
  @IsOptional()
  @IsEnum(PerformanceType)
  performanceType?: PerformanceType;

  @ApiPropertyOptional({
    description: 'Performance description or overview',
    example: 'A story about journey and connection',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  performanceDescription?: string;

  @ApiPropertyOptional({
    description: 'Poetry topic. Official topic is Searching / Finding the Right Person.',
    example: 'Searching / Finding the Right Person',
    default: 'Searching / Finding the Right Person',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  topic?: string;

  @ApiPropertyOptional({
    description: 'Optional participant photo URL (e.g. from Cloudinary for giveaways)',
    example: 'https://res.cloudinary.com/dobato/image/upload/v12345/photo.jpg',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  photoUrl?: string;

  @ApiPropertyOptional({
    description: 'Alias for stageIntroductionName',
    example: 'DJ Anil',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  stageName?: string;

  @ApiProperty({
    description: 'Agreement to photography/video usage for promotional purposes (Must be true)',
    example: true,
  })
  @IsBoolean({ message: 'Media agreement must be a boolean' })
  @Equals(true, { message: 'By submitting form, you agree that DOBATO may use photographs/videos of your participation for promotional purposes.' })
  mediaAgreement: boolean;

  @ApiPropertyOptional({ example: 'DBT-X7K4P9', description: 'Optional referral code' })
  @IsOptional()
  @IsString()
  referralCode?: string;

  @ApiPropertyOptional({ example: 'instagram', description: 'UTM source' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  utmSource?: string;

  @ApiPropertyOptional({ example: 'social', description: 'UTM medium' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  utmMedium?: string;

  @ApiPropertyOptional({ example: 'dobato_launch', description: 'UTM campaign' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  utmCampaign?: string;

  @ApiPropertyOptional({ example: 'hero_button', description: 'UTM content' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  utmContent?: string;

  @ApiPropertyOptional({ example: 'poetry_contest', description: 'UTM term' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  utmTerm?: string;

  // Deprecated fields accepted for backward compatibility
  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(PoetryLanguage)
  poetryLanguage?: PoetryLanguage;

  @IsOptional()
  microphoneRequired?: boolean;

  @IsOptional()
  needsMicrophone?: boolean;

  @IsOptional()
  microphoneRequirement?: boolean;

  @IsOptional()
  informationConsent?: boolean;

  @IsOptional()
  eventConsent?: boolean;

  @IsOptional()
  mediaConsent?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePoetryDetailsDto)
  poetry?: CreatePoetryDetailsDto | null;

  @IsOptional()
  @IsString()
  utm_source?: string;

  @IsOptional()
  @IsString()
  utm_medium?: string;

  @IsOptional()
  @IsString()
  utm_campaign?: string;

  @IsOptional()
  @IsString()
  utm_content?: string;

  @IsOptional()
  @IsString()
  utm_term?: string;
}
