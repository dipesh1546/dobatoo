import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
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
import { PoetryJudgingService } from '../poetry-judging/poetry-judging.service';
import { AdminPoetryQueryDto } from './dto/admin-query.dto';
import { AssignJudgeToPoetryDto } from './dto/admin-judge.dto';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentAdmin, AuthenticatedAdminPayload } from '../../common/decorators/current-admin.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin - Poetry Participants')
@Controller('admin/poetry')
@UseGuards(AdminAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminPoetryController {
  constructor(
    private readonly adminService: AdminService,
    private readonly judgingService: PoetryJudgingService,
  ) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EVENT_ADMIN)
  @ApiOperation({
    summary: 'List & Search Poetry Competition Participants',
    description: 'Retrieves paginated poetry participant records with fixed topic DOBATO, language, and performance style filters.',
  })
  @ApiResponse({
    status: 200,
    description: 'Poetry participants fetched successfully',
  })
  async getPoetryParticipants(@Query() query: AdminPoetryQueryDto) {
    const data = await this.adminService.getPoetryParticipants(query);
    return {
      success: true,
      message: 'Poetry participants fetched successfully.',
      data: data.items,
      pagination: data.pagination,
    };
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EVENT_ADMIN)
  @ApiOperation({
    summary: 'Get Poetry Participant Details',
    description: 'Retrieves full poetry submission details including assigned judges and scores.',
  })
  @ApiParam({ name: 'id', description: 'PoetryParticipant UUID or ObjectId' })
  @ApiResponse({
    status: 200,
    description: 'Poetry participant details fetched successfully',
  })
  @ApiResponse({ status: 404, description: 'Poetry participant not found' })
  async getPoetryParticipantById(@Param('id') id: string) {
    const data = await this.adminService.getPoetryParticipantById(id);
    return {
      success: true,
      message: 'Poetry participant details fetched successfully.',
      data,
    };
  }

  @Post(':id/assign-judge')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EVENT_ADMIN)
  @ApiOperation({
    summary: 'Assign Judge to Poetry Participant',
    description: 'Assigns an active judge to evaluate a specific poetry submission.',
  })
  @ApiParam({ name: 'id', description: 'PoetryParticipant ID' })
  @ApiResponse({ status: 200, description: 'Judge assigned successfully' })
  @ApiResponse({ status: 409, description: 'Judge already assigned' })
  async assignJudge(
    @Param('id') participantId: string,
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
    @Body() dto: AssignJudgeToPoetryDto,
  ) {
    const data = await this.judgingService.assignJudge(
      dto.judgeId,
      participantId,
      admin.id,
    );
    return {
      success: true,
      message: 'Judge assigned to poetry submission successfully.',
      data,
    };
  }
}
