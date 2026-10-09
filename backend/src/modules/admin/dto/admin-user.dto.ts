import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateAdminUserDto {
  @ApiProperty({ example: 'Sita Sharma', description: 'Admin user full name' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @ApiProperty({ example: 'sita@dobato.app', description: 'Admin user email address' })
  @IsEmail({}, { message: 'A valid email address is required' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email: string;

  @ApiProperty({ example: 'SecureAdminPass@2026', description: 'Admin password (min 8 chars)' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.EVENT_ADMIN, description: 'Role assigned to user' })
  @IsOptional()
  @IsEnum(Role, { message: 'Role must be a valid system role (SUPER_ADMIN, EVENT_ADMIN, ADMIN)' })
  role?: Role;
}

export class UpdateAdminUserDto {
  @ApiPropertyOptional({ example: 'Sita Sharma' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;

  @ApiPropertyOptional({ example: 'sita.updated@dobato.app' })
  @IsOptional()
  @IsEmail({}, { message: 'A valid email address is required' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email?: string;

  @ApiPropertyOptional({ example: 'NewSecretPass@2026', description: 'Leave blank to keep unchanged' })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password?: string;

  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAdminUserStatusDto {
  @ApiProperty({ example: true, description: 'Active status flag' })
  @IsBoolean()
  isActive: boolean;
}
