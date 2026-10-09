import {
  Controller,
  Get,
  Post,
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
} from '@nestjs/swagger';
import { JudgeAuthGuard } from '../../common/guards/judge-auth.guard';
import { CurrentJudge, CurrentJudgePayload } from '../../common/decorators/current-judge.decorator';
import { PoetryJudgingService } from './poetry-judging.service';
import { JudgeLoginDto, SubmitScoresDto } from './dto/judge.dto';

@ApiTags('Judge Interface (Phase 7)')
@Controller('judge')
export class JudgeController {
  constructor(private readonly judgingService: PoetryJudgingService) {}

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Judge login' })
  @ApiResponse({ status: 200, description: 'Login successful, returns access token.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() dto: JudgeLoginDto) {
    const data = await this.judgingService.loginJudge(dto);
    return { message: 'Judge login successful.', data };
  }

  @Get('auth/me')
  @ApiBearerAuth()
  @UseGuards(JudgeAuthGuard)
  @ApiOperation({ summary: 'Get current authenticated judge profile' })
  @ApiResponse({ status: 200, description: 'Judge profile fetched successfully.' })
  async getMe(@CurrentJudge() judge: CurrentJudgePayload) {
    const data = await this.judgingService.getJudgeMe(judge.id);
    return { message: 'Judge profile fetched successfully.', data };
  }

  @Post('auth/logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JudgeAuthGuard)
  @ApiOperation({ summary: 'Judge logout' })
  @ApiResponse({ status: 200, description: 'Judge logout successful.' })
  async logout(@CurrentJudge() judge: CurrentJudgePayload) {
    return this.judgingService.logoutJudge(judge.id);
  }

  @Get('dashboard')
  @ApiBearerAuth()
  @UseGuards(JudgeAuthGuard)
  @ApiOperation({ summary: 'Get judge dashboard stats and competition info' })
  @ApiResponse({ status: 200, description: 'Judge dashboard fetched successfully.' })
  async getDashboard(@CurrentJudge() judge: CurrentJudgePayload) {
    const data = await this.judgingService.getJudgeDashboard(judge.id);
    return { message: 'Judge dashboard fetched successfully.', data };
  }

  @Get('assignments')
  @ApiBearerAuth()
  @UseGuards(JudgeAuthGuard)
  @ApiOperation({ summary: 'Get list of assigned poetry participants' })
  @ApiResponse({ status: 200, description: 'Assignments fetched successfully.' })
  async getAssignments(@CurrentJudge() judge: CurrentJudgePayload) {
    const data = await this.judgingService.getJudgeAssignments(judge.id);
    return { message: 'Judge assignments fetched successfully.', data };
  }

  @Get('poetry/:participantId')
  @ApiBearerAuth()
  @UseGuards(JudgeAuthGuard)
  @ApiOperation({ summary: 'Get details and assigned criteria for a poetry entry' })
  @ApiResponse({ status: 200, description: 'Participant judging details fetched successfully.' })
  @ApiResponse({ status: 403, description: 'Judge is not assigned to view this participant.' })
  async getParticipantDetail(
    @CurrentJudge() judge: CurrentJudgePayload,
    @Param('participantId') participantId: string,
  ) {
    const data = await this.judgingService.getJudgeParticipantDetail(
      judge.id,
      participantId,
    );
    return { message: 'Participant details fetched successfully.', data };
  }

  @Post('poetry/:participantId/scores')
  @ApiBearerAuth()
  @UseGuards(JudgeAuthGuard)
  @ApiOperation({ summary: 'Submit or edit scores for assigned participant' })
  @ApiResponse({ status: 200, description: 'Scores submitted successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed or competition is locked.' })
  @ApiResponse({ status: 403, description: 'Judge is not assigned to score this participant.' })
  async submitScores(
    @CurrentJudge() judge: CurrentJudgePayload,
    @Param('participantId') participantId: string,
    @Body() dto: SubmitScoresDto,
  ) {
    return this.judgingService.submitScores(judge.id, participantId, dto);
  }
}
