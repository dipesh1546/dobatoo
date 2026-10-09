import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
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
import { AdminRegistrationQueryDto } from './dto/admin-query.dto';
import {
  AdminCreateRegistrationDto,
  AdminUpdateRegistrationDto,
} from './dto/admin-registration.dto';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentAdmin, AuthenticatedAdminPayload } from '../../common/decorators/current-admin.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin - Registrations')
@Controller('admin/registrations')
@UseGuards(AdminAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminRegistrationController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EVENT_ADMIN)
  @ApiOperation({
    summary: 'List & Search Registrations (Paginated)',
    description: 'Provides paginated, filterable, and searchable registration records for authorized admins.',
  })
  @ApiResponse({
    status: 200,
    description: 'Registrations fetched successfully',
  })
  async getRegistrations(@Query() query: AdminRegistrationQueryDto) {
    const data = await this.adminService.getRegistrations(query);
    return {
      success: true,
      message: 'Registrations fetched successfully.',
      data: data.items,
      pagination: data.pagination,
    };
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EVENT_ADMIN)
  @ApiOperation({
    summary: 'Get Detailed Registration Record',
    description: 'Retrieves complete registration details by UUID or registrationId (e.g. DBT-2026-000123).',
  })
  @ApiParam({ name: 'id', description: 'Registration UUID or registrationId', example: 'DBT-2026-000123' })
  @ApiResponse({
    status: 200,
    description: 'Registration details fetched successfully',
  })
  @ApiResponse({ status: 404, description: 'Registration not found' })
  async getRegistrationById(@Param('id') id: string) {
    const data = await this.adminService.getRegistrationById(id);
    return {
      success: true,
      message: 'Registration details fetched successfully.',
      data,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EVENT_ADMIN)
  @ApiOperation({
    summary: 'Manually Create Participant Registration',
    description: 'Allows an administrator to manually register a participant or performer with full validation and auto-generated DBT registration ID.',
  })
  @ApiResponse({
    status: 201,
    description: 'Registration created successfully',
  })
  @ApiResponse({ status: 409, description: 'Email or phone already registered' })
  async createRegistration(
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
    @Body() dto: AdminCreateRegistrationDto,
  ) {
    const data = await this.adminService.createRegistrationByAdmin(dto, admin.id);
    return {
      success: true,
      message: 'Registration created successfully.',
      data,
    };
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EVENT_ADMIN)
  @ApiOperation({
    summary: 'Update Participant Registration Details',
    description: 'Allows an administrator to update registration details, contact info, or performance submission.',
  })
  @ApiParam({ name: 'id', description: 'Registration ID or registrationId' })
  @ApiResponse({
    status: 200,
    description: 'Registration updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Registration not found' })
  async updateRegistration(
    @Param('id') id: string,
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
    @Body() dto: AdminUpdateRegistrationDto,
  ) {
    const data = await this.adminService.updateRegistrationByAdmin(id, dto, admin.id);
    return {
      success: true,
      message: 'Registration updated successfully.',
      data,
    };
  }
}
