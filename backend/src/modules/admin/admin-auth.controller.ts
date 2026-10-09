import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AdminService } from './admin.service';
import { AdminLoginDto, AdminLoginResponseDto, AdminProfileDto } from './dto/admin-auth.dto';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { Logger } from '@nestjs/common';
import { CurrentAdmin, AuthenticatedAdminPayload } from '../../common/decorators/current-admin.decorator';

@ApiTags('Admin - Auth')
@Controller('admin/auth')
export class AdminAuthController {
  private readonly logger = new Logger(AdminAuthController.name);

  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 attempts per IP per 15 minutes
  @ApiOperation({
    summary: 'Admin Portal Login',
    description: 'Authenticates administrative users and returns a JWT access token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AdminLoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests (Rate limit exceeded)',
  })
  async login(
    @Body() dto: AdminLoginDto,
  ): Promise<any> {
    this.logger.log(`[Admin Login] Received login request for: ${dto.email}`);
    const result = await this.adminService.login(dto);

    const user = {
      id: result.admin.id,
      name: result.admin.name,
      email: result.admin.email,
      role: result.admin.role,
      token: result.accessToken,
      accessToken: result.accessToken,
    };

    return {
      success: true,
      message: 'Login successful.',
      data: {
        ...user,
        admin: result.admin,
        token: result.accessToken,
        accessToken: result.accessToken,
      },
      ...user,
      token: result.accessToken,
      accessToken: result.accessToken,
      admin: result.admin,
    };
  }

  @Get('me')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Authenticated Admin Profile',
    description: 'Returns profile and role information for the currently logged-in administrator.',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin profile fetched successfully',
    type: AdminProfileDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access token missing or invalid',
  })
  async getMe(
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
  ): Promise<{ message: string; data: AdminProfileDto }> {
    const data = await this.adminService.getMe(admin.id);
    return {
      message: 'Admin profile fetched successfully.',
      data,
    };
  }

  @Post('logout')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Admin Logout',
    description: 'Logs out the authenticated administrator and records an audit log.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
  async logout(
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
  ): Promise<{ message: string }> {
    return this.adminService.logout(admin.id);
  }
}
