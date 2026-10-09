import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({
    example: 'superadmin@dobato.app',
    description: 'Registered admin user email address',
  })
  @IsEmail({}, { message: 'A valid email address is required' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email: string;

  @ApiProperty({
    example: 'AdminSecret@2026',
    description: 'Admin password',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

export class AdminProfileDto {
  @ApiProperty({ example: 'admin-uuid-123' })
  id: string;

  @ApiProperty({ example: 'DOBATO Super Admin' })
  name: string;

  @ApiProperty({ example: 'superadmin@dobato.app' })
  email: string;

  @ApiProperty({ example: 'SUPER_ADMIN' })
  role: string;
}

export class AdminLoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ type: AdminProfileDto })
  admin: AdminProfileDto;
}
