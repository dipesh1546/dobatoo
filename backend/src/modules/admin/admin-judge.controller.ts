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
import { PoetryJudgingService } from '../poetry-judging/poetry-judging.service';
import {
  AdminCreateJudgeDto,
  AdminUpdateJudgeDto,
  AdminUpdateJudgeStatusDto,
} from './dto/admin-judge.dto';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentAdmin, AuthenticatedAdminPayload } from '../../common/decorators/current-admin.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin - Judges')
@Controller('admin/judges')
@UseGuards(AdminAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminJudgeController {
  constructor(private readonly judgingService: PoetryJudgingService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EVENT_ADMIN)
  @ApiOperation({
    summary: 'List All Judges',
    description: 'Retrieves all judge accounts with active status, assignment counts, and timestamps.',
  })
  @ApiResponse({ status: 200, description: 'Judges listed successfully' })
  async getJudges() {
    const data = await this.judgingService.getJudges();
    return {
      success: true,
      message: 'Judges fetched successfully.',
      data,
    };
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EVENT_ADMIN)
  @ApiOperation({
    summary: 'Get Judge Details',
    description: 'Retrieves judge details and current assignments.',
  })
  @ApiParam({ name: 'id', description: 'Judge ID' })
  @ApiResponse({ status: 200, description: 'Judge retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Judge not found' })
  async getJudgeById(@Param('id') id: string) {
    const data = await this.judgingService.getJudgeById(id);
    return {
      success: true,
      message: 'Judge details fetched successfully.',
      data,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EVENT_ADMIN)
  @ApiOperation({
    summary: 'Add New Judge',
    description: 'Creates a new judge account with securely hashed password.',
  })
  @ApiResponse({ status: 201, description: 'Judge created successfully' })
  @ApiResponse({ status: 409, description: 'Judge email already exists' })
  async createJudge(
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
    @Body() dto: AdminCreateJudgeDto,
  ) {
    const data = await this.judgingService.createJudge(dto, admin.id);
    return {
      success: true,
      message: 'Judge account created successfully.',
      data,
    };
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EVENT_ADMIN)
  @ApiOperation({
    summary: 'Update Judge Account',
    description: 'Updates judge contact information, active state, or password.',
  })
  @ApiParam({ name: 'id', description: 'Judge ID' })
  @ApiResponse({ status: 200, description: 'Judge updated successfully' })
  @ApiResponse({ status: 404, description: 'Judge not found' })
  async updateJudge(
    @Param('id') id: string,
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
    @Body() dto: AdminUpdateJudgeDto,
  ) {
    const data = await this.judgingService.updateJudge(id, dto, admin.id);
    return {
      success: true,
      message: 'Judge updated successfully.',
      data,
    };
  }

  @Patch(':id/status')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EVENT_ADMIN)
  @ApiOperation({
    summary: 'Activate or Deactivate Judge',
    description: 'Toggles judge access status.',
  })
  @ApiParam({ name: 'id', description: 'Judge ID' })
  @ApiResponse({ status: 200, description: 'Judge status updated successfully' })
  @ApiResponse({ status: 404, description: 'Judge not found' })
  async updateJudgeStatus(
    @Param('id') id: string,
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
    @Body() dto: AdminUpdateJudgeStatusDto,
  ) {
    const data = await this.judgingService.updateJudge(id, { isActive: dto.isActive }, admin.id);
    return {
      success: true,
      message: `Judge ${dto.isActive ? 'activated' : 'deactivated'} successfully.`,
      data,
    };
  }
}
