import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentAdmin, AuthenticatedAdminPayload } from '../../common/decorators/current-admin.decorator';
import { Role } from '@prisma/client';
import { PoetryJudgingService } from './poetry-judging.service';
import { AdminService } from '../admin/admin.service';
import { AdminPoetryQueryDto } from '../admin/dto/admin-query.dto';
import {
  CreateJudgeDto,
  UpdateJudgeDto,
  AssignJudgeDto,
  CreateCriterionDto,
  UpdateCriterionDto,
  UpdateCompetitionStatusDto,
  ReviewEntryDto,
  SelectWinnersDto,
} from './dto/admin-judging.dto';

@ApiTags('Admin Poetry Judging (Phase 7)')
@ApiBearerAuth()
@Controller('admin/poetry')
@UseGuards(AdminAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.EVENT_ADMIN)
export class AdminPoetryJudgingController {
  constructor(
    private readonly judgingService: PoetryJudgingService,
    private readonly adminService: AdminService,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get poetry competition statistics' })
  @ApiResponse({ status: 200, description: 'Poetry stats fetched successfully.' })
  async getPoetryStats() {
    const data = await this.judgingService.getPoetryStats();
    return { message: 'Poetry statistics fetched successfully.', data };
  }

  @Get()
  @ApiOperation({ summary: 'Get poetry entries listing with search and filters' })
  @ApiResponse({ status: 200, description: 'Poetry entries retrieved successfully.' })
  async getPoetryEntries(@Query() query: AdminPoetryQueryDto) {
    return this.adminService.getPoetryParticipants(query);
  }

  @Get('judges')
  @ApiOperation({ summary: 'List all judge accounts' })
  @ApiResponse({ status: 200, description: 'Judges listed successfully.' })
  async getJudges() {
    const data = await this.judgingService.getJudges();
    return { message: 'Judges fetched successfully.', data };
  }

  @Post('judges')
  @ApiOperation({ summary: 'Create a new judge account' })
  @ApiResponse({ status: 201, description: 'Judge account created successfully.' })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  async createJudge(
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
    @Body() dto: CreateJudgeDto,
  ) {
    const data = await this.judgingService.createJudge(dto, admin.id);
    return { message: 'Judge account created successfully.', data };
  }

  @Patch('judges/:id')
  @ApiOperation({ summary: 'Update judge account profile or status' })
  @ApiResponse({ status: 200, description: 'Judge account updated successfully.' })
  async updateJudge(
    @Param('id') id: string,
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
    @Body() dto: UpdateJudgeDto,
  ) {
    const data = await this.judgingService.updateJudge(id, dto, admin.id);
    return { message: 'Judge updated successfully.', data };
  }

  @Post('judges/:judgeId/assign')
  @ApiOperation({ summary: 'Assign judge to a poetry participant' })
  @ApiResponse({ status: 201, description: 'Judge assigned successfully.' })
  @ApiResponse({ status: 409, description: 'Judge already assigned.' })
  async assignJudge(
    @Param('judgeId') judgeId: string,
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
    @Body() dto: AssignJudgeDto,
  ) {
    const data = await this.judgingService.assignJudge(judgeId, dto.participantId, admin.id);
    return { message: 'Judge assigned successfully.', data };
  }

  @Delete('judges/:judgeId/assignments/:assignmentId')
  @ApiOperation({ summary: 'Remove judge assignment' })
  @ApiResponse({ status: 200, description: 'Assignment removed successfully.' })
  async removeAssignment(
    @Param('judgeId') judgeId: string,
    @Param('assignmentId') assignmentId: string,
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
  ) {
    return this.judgingService.removeAssignment(judgeId, assignmentId, admin.id);
  }

  @Get('criteria')
  @ApiOperation({ summary: 'Get judging criteria' })
  @ApiResponse({ status: 200, description: 'Criteria fetched successfully.' })
  async getCriteria() {
    const data = await this.judgingService.getCriteria();
    return { message: 'Judging criteria fetched successfully.', data };
  }

  @Post('criteria')
  @ApiOperation({ summary: 'Create a new judging criterion' })
  @ApiResponse({ status: 201, description: 'Criterion created successfully.' })
  async createCriterion(
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
    @Body() dto: CreateCriterionDto,
  ) {
    const data = await this.judgingService.createCriterion(dto, admin.id);
    return { message: 'Judging criterion created successfully.', data };
  }

  @Patch('criteria/:id')
  @ApiOperation({ summary: 'Update a judging criterion' })
  @ApiResponse({ status: 200, description: 'Criterion updated successfully.' })
  async updateCriterion(
    @Param('id') id: string,
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
    @Body() dto: UpdateCriterionDto,
  ) {
    const data = await this.judgingService.updateCriterion(id, dto, admin.id);
    return { message: 'Judging criterion updated successfully.', data };
  }

  @Delete('criteria/:id')
  @ApiOperation({ summary: 'Delete a judging criterion' })
  @ApiResponse({ status: 200, description: 'Criterion deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Cannot delete criterion with submitted scores.' })
  async deleteCriterion(
    @Param('id') id: string,
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
  ) {
    return this.judgingService.deleteCriterion(id, admin.id);
  }

  @Post('status')
  @ApiOperation({ summary: 'Update competition state' })
  @ApiResponse({ status: 200, description: 'Competition status updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid transition or criteria weight validation failure.' })
  async updateCompetitionStatus(
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
    @Body() dto: UpdateCompetitionStatusDto,
  ) {
    const data = await this.judgingService.updateCompetitionStatus(dto, admin.id);
    return { message: 'Competition status updated successfully.', data };
  }

  @Get('results')
  @ApiOperation({ summary: 'Get aggregated scores and rankings' })
  @ApiResponse({ status: 200, description: 'Results calculated successfully.' })
  async getResults() {
    const data = await this.judgingService.getResults();
    return { message: 'Competition results fetched successfully.', data };
  }

  @Post('winners')
  @ApiOperation({ summary: 'Select 1st, 2nd, and 3rd place winners' })
  @ApiResponse({ status: 200, description: 'Winners selected successfully.' })
  @ApiResponse({ status: 400, description: 'Selection must occur in FINAL_REVIEW state with positions 1, 2, and 3.' })
  async selectWinners(
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
    @Body() dto: SelectWinnersDto,
  ) {
    return this.judgingService.selectWinners(dto, admin.id);
  }

  @Post('finalize')
  @ApiOperation({ summary: 'Finalize competition and lock all results' })
  @ApiResponse({ status: 200, description: 'Competition finalized and locked.' })
  async finalizeCompetition(@CurrentAdmin() admin: AuthenticatedAdminPayload) {
    return this.judgingService.finalizeCompetition(admin.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get poetry entry details by ID' })
  @ApiResponse({ status: 200, description: 'Entry details fetched successfully.' })
  async getPoetryEntryById(@Param('id') id: string) {
    return this.adminService.getPoetryParticipantById(id);
  }

  @Patch(':id/review')
  @ApiOperation({ summary: 'Update participant entry review status and internal note' })
  @ApiResponse({ status: 200, description: 'Entry review updated successfully.' })
  async reviewEntry(
    @Param('id') id: string,
    @CurrentAdmin() admin: AuthenticatedAdminPayload,
    @Body() dto: ReviewEntryDto,
  ) {
    const data = await this.judgingService.reviewEntry(id, dto, admin.id);
    return { message: 'Poetry entry review updated successfully.', data };
  }
}
