import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin - Dashboard & Analytics')
@Controller('admin')
@UseGuards(AdminAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminDashboardController {
  constructor(private readonly adminService: AdminService) {}

  @Get(['dashboard', 'stats', 'dashboard/stats'])
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EVENT_ADMIN)
  @ApiOperation({
    summary: 'Get Admin Dashboard Summary Statistics',
    description: 'Retrieves aggregate registration metrics, check-in stats, and recent registration activity.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard metrics fetched successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Insufficient privileges' })
  async getDashboardStats() {
    const data = await this.adminService.getDashboardStats();
    return {
      success: true,
      message: 'Dashboard metrics fetched successfully.',
      data,
      ...data,
    };
  }

  @Get(['stats/registrations', 'stats/registrations-over-time'])
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EVENT_ADMIN)
  @ApiOperation({
    summary: 'Get Aggregated Registration Daily Growth Analytics',
    description: 'Calculates registration counts grouped by date for analytical trend reporting.',
  })
  @ApiResponse({
    status: 200,
    description: 'Registration trend analytics fetched successfully',
  })
  async getRegistrationStats() {
    const data = await this.adminService.getRegistrationStats();
    return {
      success: true,
      message: 'Registration analytics fetched successfully.',
      data,
      ...data,
    };
  }

  @Get('event')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EVENT_ADMIN)
  @ApiOperation({
    summary: 'Get Admin Active Event Settings',
    description: 'Retrieves current active event metadata, launch dates, and registration status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event configuration fetched successfully',
  })
  async getAdminEventInfo() {
    const data = await this.adminService.getAdminEventInfo();
    return {
      success: true,
      message: 'Event settings fetched successfully.',
      data,
    };
  }
}
