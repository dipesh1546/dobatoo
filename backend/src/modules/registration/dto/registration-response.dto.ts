import { ApiProperty } from '@nestjs/swagger';
import { ParticipationType } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegistrationEventSummaryDto {
  @ApiProperty({ example: 'DOBATO GRAND LAUNCH' })
  title: string;

  @ApiProperty({ example: '2026-10-16' })
  date: string;
}

export class RegistrationSuccessDataDto {
  @ApiProperty({ example: 'DBT-2026-000123' })
  registrationId: string;

  @ApiProperty({
    example: 'a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef',
    description: 'Cryptographically secure verification token for generating check-in QR code',
  })
  verificationToken: string;

  @ApiProperty({ type: RegistrationEventSummaryDto })
  event: RegistrationEventSummaryDto;

  @ApiProperty({ enum: ParticipationType, example: ParticipationType.ATTEND_ONLY })
  participationType: ParticipationType;

  @ApiProperty({ example: true, description: 'Indicates if confirmation email was dispatched successfully' })
  emailSent: boolean;
}

export class RegistrationSuccessResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Registration completed successfully.' })
  message: string;

  @ApiProperty({ type: RegistrationSuccessDataDto })
  data: RegistrationSuccessDataDto;
}

export class VerifyRegistrationTokenDto {
  @ApiProperty({
    description: 'Verification token or DOBATO_CHECKIN:<token> payload',
    example: 'a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty({ message: 'Verification token is required' })
  token: string;
}

export class VerificationResultDataDto {
  @ApiProperty({ example: true })
  valid: boolean;

  @ApiProperty({ example: 'DBT-2026-000123' })
  registrationId: string;

  @ApiProperty({ enum: ParticipationType, example: ParticipationType.ATTEND_ONLY })
  participationType: ParticipationType;

  @ApiProperty({ example: false })
  checkedIn: boolean;
}

export class VerificationSuccessResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Registration is valid.' })
  message: string;

  @ApiProperty({ type: VerificationResultDataDto })
  data: VerificationResultDataDto;
}
