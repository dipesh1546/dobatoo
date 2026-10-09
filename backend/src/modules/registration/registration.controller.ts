import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import {
  RegistrationSuccessResponseDto,
  RegistrationSuccessDataDto,
  VerifyRegistrationTokenDto,
  VerificationSuccessResponseDto,
  VerificationResultDataDto,
} from './dto/registration-response.dto';

@ApiTags('Registration')
@Controller('registrations')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 attempts per IP per 15 minutes
  @ApiOperation({
    summary: 'Submit Free DOBATO Event Registration',
    description:
      'Registers a visitor for the DOBATO Grand Launch (ATTEND_ONLY or ATTEND_AND_POETRY). Generates a secure verification token and dispatches confirmation email.',
  })
  @ApiBody({ type: CreateRegistrationDto })
  @ApiResponse({
    status: 201,
    description: 'Registration completed successfully',
    type: RegistrationSuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error (e.g. under 18, missing fields, invalid phone/email, invalid poetry payload)',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict error (e.g. duplicate email/phone registration, or registration closed)',
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests (Rate limit exceeded: max 5 requests per 15 minutes)',
  })
  async register(
    @Body() dto: CreateRegistrationDto,
  ): Promise<{ success: boolean; message: string; data: RegistrationSuccessDataDto }> {
    const data = await this.registrationService.createRegistration(dto);
    return {
      success: true,
      message: 'Registration completed successfully.',
      data,
    };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 600000 } }) // 20 attempts per IP per 10 minutes
  @ApiOperation({
    summary: 'Verify Registration Token or QR Code Payload',
    description:
      'Verifies the authenticity of an event pass token or DOBATO_CHECKIN:<token> payload. Returns validity, registration ID, and check-in status without exposing PII.',
  })
  @ApiBody({ type: VerifyRegistrationTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Registration token verified successfully',
    type: VerificationSuccessResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Invalid or expired event pass token',
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests (Rate limit exceeded: max 20 verification attempts per 10 minutes)',
  })
  async verify(
    @Body() dto: VerifyRegistrationTokenDto,
  ): Promise<{ success: boolean; message: string; data: VerificationResultDataDto }> {
    const data = await this.registrationService.verifyRegistrationToken(dto.token);
    return {
      success: true,
      message: 'Registration is valid.',
      data,
    };
  }
}
