import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import {
  CreateAdminUserDto,
  UpdateAdminUserDto,
  UpdateAdminUserStatusDto,
} from './dto/admin-user.dto';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin - User Management')
@Controller('admin/users')
@UseGuards(AdminAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminUserController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EVENT_ADMIN)
  @ApiOperation({
    summary: 'List Admin Users',
    description: 'Retrieves all administrator accounts without exposing password hashes.',
  })
  @ApiResponse({ status: 200, description: 'Admin users listed successfully' })
  async getAdminUsers() {
    const data = await this.adminService.getAdminUsers();
    return {
      success: true,
      message: 'Admin users fetched successfully.',
      data,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Add New Admin User',
    description: 'Creates a new administrator account with hashed password and assigned RBAC role.',
  })
  @ApiResponse({ status: 201, description: 'Admin user created successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async createAdminUser(@Body() dto: CreateAdminUserDto) {
    const data = await this.adminService.createAdminUser(dto);
    return {
      success: true,
      message: 'Admin user created successfully.',
      data,
    };
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Update Admin User',
    description: 'Updates administrator details, role, or resets password.',
  })
  @ApiParam({ name: 'id', description: 'Admin user ID' })
  @ApiResponse({ status: 200, description: 'Admin user updated successfully' })
  @ApiResponse({ status: 404, description: 'Admin user not found' })
  async updateAdminUser(
    @Param('id') id: string,
    @Body() dto: UpdateAdminUserDto,
  ) {
    const data = await this.adminService.updateAdminUser(id, dto);
    return {
      success: true,
      message: 'Admin user updated successfully.',
      data,
    };
  }

  @Patch(':id/status')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Activate or Deactivate Admin User',
    description: 'Toggles active status of an administrator account.',
  })
  @ApiParam({ name: 'id', description: 'Admin user ID' })
  @ApiResponse({ status: 200, description: 'Admin user status updated successfully' })
  @ApiResponse({ status: 404, description: 'Admin user not found' })
  async updateAdminUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAdminUserStatusDto,
  ) {
    const data = await this.adminService.updateAdminUserStatus(id, dto.isActive);
    return {
      success: true,
      message: `Admin user ${dto.isActive ? 'activated' : 'deactivated'} successfully.`,
      data,
    };
  }
}
