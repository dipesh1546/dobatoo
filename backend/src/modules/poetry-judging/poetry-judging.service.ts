import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  CompetitionStatus,
  ReviewStatus,
  AuditAction,
} from '@prisma/client';
import {
  CreateJudgeDto,
  UpdateJudgeDto,
  CreateCriterionDto,
  UpdateCriterionDto,
  UpdateCompetitionStatusDto,
  ReviewEntryDto,
  SelectWinnersDto,
} from './dto/admin-judging.dto';
import { JudgeLoginDto, SubmitScoresDto } from './dto/judge.dto';
import { AdminAuditService } from '../admin/admin-audit.service';

const STATUS_FLOW_ORDER: Record<CompetitionStatus, number> = {
  DRAFT: 1,
  OPEN: 2,
  JUDGING: 3,
  FINAL_REVIEW: 4,
  FINALIZED: 5,
};

@Injectable()
export class PoetryJudgingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly auditService: AdminAuditService,
  ) {}

  // ======================================================
  // 1. COMPETITION HELPER
  // ======================================================

  private async getOrCreateActiveCompetition() {
    let competition = await this.prisma.poetryCompetition.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!competition) {
      const event = await this.prisma.event.findFirst();
      if (!event) {
        throw new NotFoundException('No event found to associate poetry competition.');
      }
      competition = await this.prisma.poetryCompetition.create({
        data: {
          eventId: event.id,
          title: 'DOBATO Grand Launch Poetry Competition',
          theme: 'DOBATO',
          description: 'Official poetry competition for DOBATO platform launch 2026.',
          status: CompetitionStatus.DRAFT,
          isOpen: true,
        },
      });
    }

    return competition;
  }

  // ======================================================
  // 2. JUDGE AUTHENTICATION
  // ======================================================

  async loginJudge(dto: JudgeLoginDto) {
    const judge = await this.prisma.judge.findUnique({
      where: { email: dto.email },
    });

    if (!judge || !judge.isActive) {
      throw new UnauthorizedException('Invalid credentials or inactive judge account.');
    }

    const passwordValid = await bcrypt.compare(dto.password, judge.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    await this.prisma.judge.update({
      where: { id: judge.id },
      data: { lastLoginAt: new Date() },
    });

    const jwtSecret =
      this.configService.get<string>('JWT_SECRET') || 'dobato_super_secret_jwt_key_2026';
    const accessToken = this.jwtService.sign(
      { sub: judge.id, email: judge.email, role: 'JUDGE' },
      { secret: jwtSecret, expiresIn: '24h' },
    );

    return {
      accessToken,
      judge: {
        id: judge.id,
        name: judge.name,
        email: judge.email,
        role: judge.role,
      },
    };
  }

  async getJudgeMe(judgeId: string) {
    const judge = await this.prisma.judge.findUnique({
      where: { id: judgeId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
    });

    if (!judge) {
      throw new NotFoundException('Judge profile not found.');
    }

    return judge;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async logoutJudge(judgeId: string) {
    return { message: 'Judge logout successful.' };
  }

  // ======================================================
  // 3. ADMIN JUDGE MANAGEMENT
  // ======================================================

  async createJudge(dto: any, adminId: string) {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.prisma.judge.findUnique({
      where: { email },
    });

    if (existing) {
      throw new ConflictException('A judge with this email already exists.');
    }

    const rawPassword = dto.password || `JudgeSecret@${Math.floor(1000 + Math.random() * 9000)}`;
    const passwordHash = await bcrypt.hash(rawPassword, 10);
    const judge = await this.prisma.judge.create({
      data: {
        name: dto.name.trim(),
        email,
        phone: dto.phone ? dto.phone.trim() : null,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    await this.auditService.logAction({
      adminId,
      action: AuditAction.JUDGE_CREATED,
      entityType: 'Judge',
      entityId: judge.id,
      metadata: { email: judge.email, name: judge.name },
    });

    return judge;
  }

  async getJudges() {
    const judges = await this.prisma.judge.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            assignments: true,
            scores: true,
          },
        },
      },
    });

    return judges;
  }

  async getJudgeById(id: string) {
    const judge = await this.prisma.judge.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            participant: {
              select: {
                id: true,
                poetryTitle: true,
                topic: true,
                language: true,
                performanceType: true,
                registration: {
                  select: {
                    fullName: true,
                    registrationId: true,
                  },
                },
              },
            },
          },
        },
        scores: {
          include: {
            criterion: true,
          },
        },
      },
    });

    if (!judge) {
      throw new NotFoundException(`Judge "${id}" not found`);
    }

    return {
      id: judge.id,
      name: judge.name,
      email: judge.email,
      phone: judge.phone,
      role: judge.role,
      isActive: judge.isActive,
      lastLoginAt: judge.lastLoginAt,
      createdAt: judge.createdAt,
      updatedAt: judge.updatedAt,
      assignments: judge.assignments.map((a) => ({
        id: a.id,
        participantId: a.participantId,
        poetryTitle: a.participant.poetryTitle,
        topic: a.participant.topic || 'DOBATO',
        participantName: a.participant.registration.fullName,
        registrationId: a.participant.registration.registrationId,
        assignedAt: a.assignedAt,
      })),
      scoresCount: judge.scores.length,
    };
  }

  async updateJudge(id: string, dto: any, adminId: string) {
    const judge = await this.prisma.judge.findUnique({ where: { id } });
    if (!judge) {
      throw new NotFoundException('Judge not found.');
    }

    const data: any = {};
    if (dto.name) data.name = dto.name.trim();
    if (dto.email && dto.email.toLowerCase().trim() !== judge.email) {
      const email = dto.email.toLowerCase().trim();
      const existing = await this.prisma.judge.findUnique({ where: { email } });
      if (existing) throw new ConflictException('Email is already in use by another judge.');
      data.email = email;
    }
    if (dto.phone !== undefined) {
      data.phone = dto.phone ? dto.phone.trim() : null;
    }
    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, 10);
    }
    if (typeof dto.isActive === 'boolean') {
      data.isActive = dto.isActive;
    }

    const updated = await this.prisma.judge.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    const action =
      typeof dto.isActive === 'boolean'
        ? dto.isActive
          ? AuditAction.JUDGE_ACTIVATED
          : AuditAction.JUDGE_DEACTIVATED
        : AuditAction.JUDGE_CREATED;

    await this.auditService.logAction({
      adminId,
      action,
      entityType: 'Judge',
      entityId: id,
      metadata: { updatedFields: Object.keys(data) },
    });

    return updated;
  }

  // ======================================================
  // 4. JUDGE ASSIGNMENTS
  // ======================================================

  async assignJudge(judgeId: string, participantId: string, adminId: string) {
    const competition = await this.getOrCreateActiveCompetition();
    if (competition.status === CompetitionStatus.FINALIZED) {
      throw new BadRequestException('Competition is finalized. No assignment modifications allowed.');
    }

    const judge = await this.prisma.judge.findUnique({ where: { id: judgeId } });
    if (!judge || !judge.isActive) {
      throw new NotFoundException('Active judge not found.');
    }

    const participant = await this.prisma.poetryParticipant.findUnique({
      where: { id: participantId },
    });

    if (!participant) {
      throw new NotFoundException('Poetry participant not found.');
    }

    const existing = await this.prisma.poetryJudgeAssignment.findUnique({
      where: {
        judgeId_participantId: {
          judgeId,
          participantId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Judge is already assigned to this participant.');
    }

    const assignment = await this.prisma.poetryJudgeAssignment.create({
      data: {
        judgeId,
        competitionId: competition.id,
        participantId,
        assignedBy: adminId,
      },
      include: {
        judge: { select: { id: true, name: true, email: true } },
        participant: {
          select: {
            id: true,
            poetryTitle: true,
            registration: { select: { fullName: true, registrationId: true } },
          },
        },
      },
    });

    await this.auditService.logAction({
      adminId,
      action: AuditAction.JUDGE_ASSIGNED,
      entityType: 'PoetryJudgeAssignment',
      entityId: assignment.id,
      metadata: { judgeId, participantId },
    });

    return assignment;
  }

  async removeAssignment(judgeId: string, assignmentId: string, adminId: string) {
    const competition = await this.getOrCreateActiveCompetition();
    if (competition.status === CompetitionStatus.FINALIZED) {
      throw new BadRequestException('Competition is finalized. No assignment modifications allowed.');
    }

    const assignment = await this.prisma.poetryJudgeAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment || assignment.judgeId !== judgeId) {
      throw new NotFoundException('Assignment not found for specified judge.');
    }

    await this.prisma.poetryJudgeAssignment.delete({
      where: { id: assignmentId },
    });

    await this.auditService.logAction({
      adminId,
      action: AuditAction.JUDGE_UNASSIGNED,
      entityType: 'PoetryJudgeAssignment',
      entityId: assignmentId,
      metadata: { judgeId, participantId: assignment.participantId },
    });

    return { message: 'Judge assignment removed successfully.' };
  }

  // ======================================================
  // 5. JUDGING CRITERIA
  // ======================================================

  async getCriteria() {
    const competition = await this.getOrCreateActiveCompetition();
    return this.prisma.judgingCriterion.findMany({
      where: { competitionId: competition.id },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async createCriterion(dto: CreateCriterionDto, adminId: string) {
    const competition = await this.getOrCreateActiveCompetition();
    if (competition.status === CompetitionStatus.FINALIZED) {
      throw new BadRequestException('Competition is finalized. Criteria cannot be added.');
    }

    const criterion = await this.prisma.judgingCriterion.create({
      data: {
        competitionId: competition.id,
        name: dto.name,
        title: dto.name,
        description: dto.description,
        weight: dto.weight,
        maxScore: dto.maxScore,
        displayOrder: dto.displayOrder ?? 0,
        isActive: true,
      },
    });

    await this.auditService.logAction({
      adminId,
      action: AuditAction.CRITERION_CREATED,
      entityType: 'JudgingCriterion',
      entityId: criterion.id,
      metadata: { name: criterion.name, weight: criterion.weight },
    });

    return criterion;
  }

  async updateCriterion(id: string, dto: UpdateCriterionDto, adminId: string) {
    const competition = await this.getOrCreateActiveCompetition();
    if (competition.status === CompetitionStatus.FINALIZED) {
      throw new BadRequestException('Competition is finalized. Criteria cannot be modified.');
    }

    const criterion = await this.prisma.judgingCriterion.findUnique({ where: { id } });
    if (!criterion) {
      throw new NotFoundException('Judging criterion not found.');
    }

    const updated = await this.prisma.judgingCriterion.update({
      where: { id },
      data: {
        name: dto.name ?? criterion.name,
        title: dto.name ?? criterion.title,
        description: dto.description ?? criterion.description,
        weight: dto.weight ?? criterion.weight,
        maxScore: dto.maxScore ?? criterion.maxScore,
        displayOrder: dto.displayOrder ?? criterion.displayOrder,
        isActive: typeof dto.isActive === 'boolean' ? dto.isActive : criterion.isActive,
      },
    });

    await this.auditService.logAction({
      adminId,
      action: AuditAction.CRITERION_UPDATED,
      entityType: 'JudgingCriterion',
      entityId: id,
      metadata: { updatedFields: Object.keys(dto) },
    });

    return updated;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteCriterion(id: string, adminId: string) {
    const competition = await this.getOrCreateActiveCompetition();
    if (competition.status === CompetitionStatus.FINALIZED) {
      throw new BadRequestException('Competition is finalized. Criteria cannot be deleted.');
    }

    const criterion = await this.prisma.judgingCriterion.findUnique({ where: { id } });
    if (!criterion) {
      throw new NotFoundException('Judging criterion not found.');
    }

    const scoresCount = await this.prisma.judgeScore.count({ where: { criterionId: id } });
    if (scoresCount > 0) {
      throw new BadRequestException(
        'Cannot delete criterion with submitted scores. Prefer deactivating instead.',
      );
    }

    await this.prisma.judgingCriterion.delete({ where: { id } });

    return { message: 'Criterion deleted successfully.' };
  }

  // ======================================================
  // 6. COMPETITION STATE MACHINE
  // ======================================================

  async updateCompetitionStatus(dto: UpdateCompetitionStatusDto, adminId: string) {
    const competition = await this.getOrCreateActiveCompetition();
    const currentStatus = competition.status;
    const nextStatus = dto.status;

    if (currentStatus === nextStatus) {
      return competition;
    }

    const currentOrder = STATUS_FLOW_ORDER[currentStatus];
    const nextOrder = STATUS_FLOW_ORDER[nextStatus];

    if (nextOrder < currentOrder) {
      throw new BadRequestException(
        `Invalid status transition. Cannot transition backwards from ${currentStatus} to ${nextStatus}.`,
      );
    }

    if (nextStatus === CompetitionStatus.JUDGING) {
      await this.validateCriteriaForJudging(competition.id);
    }

    if (nextStatus === CompetitionStatus.FINALIZED) {
      throw new BadRequestException(
        'To finalize the competition, call POST /api/v1/admin/poetry/finalize with winner verification.',
      );
    }

    const updated = await this.prisma.poetryCompetition.update({
      where: { id: competition.id },
      data: { status: nextStatus },
    });

    await this.auditService.logAction({
      adminId,
      action: AuditAction.COMPETITION_STATE_CHANGED,
      entityType: 'PoetryCompetition',
      entityId: competition.id,
      metadata: { from: currentStatus, to: nextStatus },
    });

    return updated;
  }

  private async validateCriteriaForJudging(competitionId: string) {
    const criteria = await this.prisma.judgingCriterion.findMany({
      where: { competitionId, isActive: true },
    });

    if (criteria.length === 0) {
      throw new BadRequestException('Cannot enter JUDGING stage without active judging criteria.');
    }

    let totalWeight = 0;
    for (const c of criteria) {
      if (c.weight <= 0) {
        throw new BadRequestException(`Criterion "${c.name}" must have a weight greater than 0.`);
      }
      if (c.maxScore <= 0) {
        throw new BadRequestException(`Criterion "${c.name}" must have a maxScore greater than 0.`);
      }
      totalWeight += c.weight;
    }

    if (Math.abs(totalWeight - 100) > 0.01) {
      throw new BadRequestException(
        `Criteria total weight must equal 100%. Currently: ${totalWeight}%.`,
      );
    }
  }

  // ======================================================
  // 7. ENTRY REVIEW (ADMIN)
  // ======================================================

  async reviewEntry(participantId: string, dto: ReviewEntryDto, adminId: string) {
    const competition = await this.getOrCreateActiveCompetition();
    if (competition.status === CompetitionStatus.FINALIZED) {
      throw new BadRequestException('Competition is finalized. Participant reviews are locked.');
    }

    const participant = await this.prisma.poetryParticipant.findUnique({
      where: { id: participantId },
    });

    if (!participant) {
      throw new NotFoundException('Poetry participant not found.');
    }

    const updated = await this.prisma.poetryParticipant.update({
      where: { id: participantId },
      data: {
        reviewStatus: dto.reviewStatus,
        reviewNote: dto.reviewNote ?? participant.reviewNote,
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
      include: {
        registration: {
          select: {
            fullName: true,
            registrationId: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return updated;
  }

  // ======================================================
  // 8. SCORE SUBMISSION (JUDGE)
  // ======================================================

  async submitScores(judgeId: string, participantId: string, dto: SubmitScoresDto) {
    const competition = await this.getOrCreateActiveCompetition();

    if (competition.status !== CompetitionStatus.JUDGING) {
      throw new BadRequestException(
        `Score submissions are only permitted during the JUDGING stage. Current status: ${competition.status}.`,
      );
    }

    const assignment = await this.prisma.poetryJudgeAssignment.findUnique({
      where: {
        judgeId_participantId: {
          judgeId,
          participantId,
        },
      },
    });

    if (!assignment) {
      throw new ForbiddenException('Judge is not assigned to score this participant.');
    }

    const activeCriteria = await this.prisma.judgingCriterion.findMany({
      where: { competitionId: competition.id, isActive: true },
    });

    const criteriaMap = new Map<string, any>(activeCriteria.map((c) => [c.id, c]));

    for (const item of dto.scores) {
      const criterion = criteriaMap.get(item.criterionId);
      if (!criterion) {
        throw new BadRequestException(`Criterion ${item.criterionId} is invalid or inactive.`);
      }
      if (item.score < 0 || item.score > criterion.maxScore) {
        throw new BadRequestException(
          `Score for criterion "${criterion.name}" must be between 0 and ${criterion.maxScore}.`,
        );
      }
    }

    const upsertedScores = await this.prisma.$transaction(
      dto.scores.map((item) =>
        this.prisma.judgeScore.upsert({
          where: {
            judgeId_participantId_criterionId: {
              judgeId,
              participantId,
              criterionId: item.criterionId,
            },
          },
          create: {
            competitionId: competition.id,
            judgeId,
            participantId,
            criterionId: item.criterionId,
            score: item.score,
            comment: item.comment,
          },
          update: {
            score: item.score,
            comment: item.comment,
            updatedAt: new Date(),
          },
        }),
      ),
    );

    return {
      message: 'Scores submitted successfully.',
      count: upsertedScores.length,
      scores: upsertedScores,
    };
  }

  // ======================================================
  // 9. SCORE AGGREGATION & RESULTS
  // ======================================================

  async getResults() {
    const competition = await this.getOrCreateActiveCompetition();
    const criteria = await this.prisma.judgingCriterion.findMany({
      where: { competitionId: competition.id, isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    const participants = await this.prisma.poetryParticipant.findMany({
      include: {
        registration: {
          select: {
            registrationId: true,
            fullName: true,
          },
        },
        assignments: {
          include: {
            judge: { select: { id: true, name: true } },
          },
        },
        scores: {
          include: {
            criterion: true,
          },
        },
      },
    });

    const results = participants.map((p) => {
      const assignedJudgeCount = p.assignments.length;
      let isComplete = false;
      let weightedScore = 0;

      if (assignedJudgeCount > 0 && criteria.length > 0) {
        let totalWeightedPercentage = 0;

        for (const criterion of criteria) {
          const criterionScores = p.scores.filter((s) => s.criterionId === criterion.id);
          const avgScore =
            criterionScores.length > 0
              ? criterionScores.reduce((acc, curr) => acc + curr.score, 0) / criterionScores.length
              : 0;

          const criterionPct = (avgScore / criterion.maxScore) * 100;
          totalWeightedPercentage += (criterionPct * criterion.weight) / 100;
        }

        weightedScore = Number(totalWeightedPercentage.toFixed(2));
        const totalExpectedScores = assignedJudgeCount * criteria.length;
        isComplete = p.scores.length >= totalExpectedScores;
      }

      return {
        participantId: p.id,
        registrationId: p.registration.registrationId,
        fullName: p.registration.fullName,
        poetryTitle: p.poetryTitle,
        language: p.language,
        performanceType: p.performanceType,
        reviewStatus: p.reviewStatus,
        assignedJudgesCount: assignedJudgeCount,
        totalScoresSubmitted: p.scores.length,
        isComplete,
        weightedScore,
      };
    });

    results.sort((a, b) => b.weightedScore - a.weightedScore);

    let currentRank = 1;
    let isTie = false;
    let tieMessage: string | null = null;

    const rankedResults = results.map((item, index) => {
      if (index > 0 && item.weightedScore === results[index - 1].weightedScore) {
        if (item.weightedScore > 0) {
          isTie = true;
          tieMessage = 'Tie requires organizer review.';
        }
      } else {
        currentRank = index + 1;
      }
      return {
        ...item,
        rank: currentRank,
      };
    });

    return {
      competitionStatus: competition.status,
      isTie,
      tieMessage,
      results: rankedResults,
    };
  }

  // ======================================================
  // 10. WINNER SELECTION & FINALIZATION
  // ======================================================

  async selectWinners(dto: SelectWinnersDto, adminId: string) {
    const competition = await this.getOrCreateActiveCompetition();

    if (competition.status !== CompetitionStatus.FINAL_REVIEW) {
      throw new BadRequestException(
        `Winners can only be selected during FINAL_REVIEW. Current status: ${competition.status}.`,
      );
    }

    const positions = dto.winners.map((w) => w.position);
    if (!positions.includes(1) || !positions.includes(2) || !positions.includes(3)) {
      throw new BadRequestException('Winner selection requires entries for positions 1, 2, and 3.');
    }

    const participantIds = dto.winners.map((w) => w.participantId);
    if (new Set(participantIds).size !== participantIds.length) {
      throw new BadRequestException('Duplicate participant assigned to multiple winner positions.');
    }

    const prizes = await this.prisma.prize.findMany({
      where: { eventId: competition.eventId },
      orderBy: { position: 'asc' },
    });

    const prizeMap = new Map<number, any>(prizes.map((p) => [p.position, p]));

    const results = await this.getResults();
    const resultMap = new Map(results.results.map((r) => [r.participantId, r.weightedScore]));

    const winnerRecords = await this.prisma.$transaction(async (tx) => {
      await tx.poetryWinner.deleteMany({
        where: { competitionId: competition.id },
      });

      const created = [];
      for (const item of dto.winners) {
        const participant = await tx.poetryParticipant.findUnique({
          where: { id: item.participantId },
        });
        if (!participant) {
          throw new NotFoundException(`Participant ${item.participantId} not found.`);
        }

        const score = resultMap.get(item.participantId) ?? 0;
        const winner = await tx.poetryWinner.create({
          data: {
            competitionId: competition.id,
            participantId: item.participantId,
            position: item.position,
            score,
            selectedBy: adminId,
          },
          include: {
            participant: {
              select: {
                poetryTitle: true,
                registration: { select: { fullName: true, registrationId: true } },
              },
            },
          },
        });
        created.push(winner);
      }
      return created;
    });

    await this.auditService.logAction({
      adminId,
      action: AuditAction.WINNER_SELECTED,
      entityType: 'PoetryWinner',
      entityId: competition.id,
      metadata: { count: winnerRecords.length },
    });

    const mappedWinners = winnerRecords.map((w: any) => {
      const prize = prizeMap.get(w.position);
      return {
        id: w.id,
        position: w.position,
        participantId: w.participantId,
        participantName: w.participant.registration.fullName,
        registrationId: w.participant.registration.registrationId,
        poetryTitle: w.participant.poetryTitle,
        score: w.score,
        prize: prize
          ? { title: prize.title, cashAmount: Number(prize.cashAmount), currency: prize.currency }
          : { title: `Position ${w.position}`, cashAmount: 0, currency: 'NPR' },
      };
    });

    return {
      message: 'Winners selected successfully.',
      winners: mappedWinners,
    };
  }

  async finalizeCompetition(adminId: string) {
    const competition = await this.getOrCreateActiveCompetition();

    if (competition.status !== CompetitionStatus.FINAL_REVIEW) {
      throw new BadRequestException(
        `Competition can only be finalized from FINAL_REVIEW state. Current status: ${competition.status}.`,
      );
    }

    const winners = await this.prisma.poetryWinner.findMany({
      where: { competitionId: competition.id },
    });

    if (winners.length < 3) {
      throw new BadRequestException('Cannot finalize competition before selecting 1st, 2nd, and 3rd place winners.');
    }

    const finalized = await this.prisma.poetryCompetition.update({
      where: { id: competition.id },
      data: {
        status: CompetitionStatus.FINALIZED,
        finalizedAt: new Date(),
        finalizedBy: adminId,
      },
    });

    await this.auditService.logAction({
      adminId,
      action: AuditAction.RESULTS_FINALIZED,
      entityType: 'PoetryCompetition',
      entityId: competition.id,
      metadata: { finalizedAt: finalized.finalizedAt },
    });

    return {
      message: 'Competition successfully finalized and locked.',
      competition: finalized,
    };
  }

  // ======================================================
  // 11. DASHBOARDS & VIEWS
  // ======================================================

  async getPoetryStats() {
    const competition = await this.getOrCreateActiveCompetition();
    const totalParticipants = await this.prisma.poetryParticipant.count();

    const checkedIn = await this.prisma.poetryParticipant.count({
      where: {
        registration: {
          status: 'CHECKED_IN',
        },
      },
    });

    const reviewed = await this.prisma.poetryParticipant.count({
      where: { reviewStatus: ReviewStatus.REVIEWED },
    });

    const pendingReview = await this.prisma.poetryParticipant.count({
      where: { reviewStatus: ReviewStatus.PENDING },
    });

    const assignedParticipantIds = (
      await this.prisma.poetryJudgeAssignment.findMany({
        distinct: ['participantId'],
        select: { participantId: true },
      })
    ).map((a) => a.participantId);

    const judged = assignedParticipantIds.length;
    const pendingJudging = Math.max(0, totalParticipants - judged);

    return {
      totalParticipants,
      checkedIn,
      reviewed,
      pendingReview,
      judged,
      pendingJudging,
      competitionStatus: competition.status,
    };
  }

  async getJudgeDashboard(judgeId: string) {
    const competition = await this.getOrCreateActiveCompetition();
    const assignments = await this.prisma.poetryJudgeAssignment.findMany({
      where: { judgeId },
      include: {
        participant: {
          include: {
            scores: { where: { judgeId } },
          },
        },
      },
    });

    const activeCriteriaCount = await this.prisma.judgingCriterion.count({
      where: { competitionId: competition.id, isActive: true },
    });

    let completedScores = 0;
    let pendingScores = 0;

    for (const a of assignments) {
      if (a.participant.scores.length >= activeCriteriaCount && activeCriteriaCount > 0) {
        completedScores++;
      } else {
        pendingScores++;
      }
    }

    return {
      competition: {
        id: competition.id,
        title: competition.title,
        theme: competition.theme,
        status: competition.status,
      },
      assignedParticipants: assignments.length,
      pendingScores,
      completedScores,
    };
  }

  async getJudgeAssignments(judgeId: string) {
    const assignments = await this.prisma.poetryJudgeAssignment.findMany({
      where: { judgeId },
      include: {
        participant: {
          select: {
            id: true,
            poetryTitle: true,
            language: true,
            performanceType: true,
            description: true,
            scores: {
              where: { judgeId },
              select: {
                criterionId: true,
                score: true,
                comment: true,
              },
            },
          },
        },
      },
    });

    return assignments.map((a) => ({
      assignmentId: a.id,
      assignedAt: a.assignedAt,
      participant: {
        id: a.participant.id,
        poetryTitle: a.participant.poetryTitle,
        language: a.participant.language,
        performanceType: a.participant.performanceType,
        description: a.participant.description,
        scoresSubmitted: a.participant.scores.length,
      },
    }));
  }

  async getJudgeParticipantDetail(judgeId: string, participantId: string) {
    const competition = await this.getOrCreateActiveCompetition();

    const assignment = await this.prisma.poetryJudgeAssignment.findUnique({
      where: {
        judgeId_participantId: {
          judgeId,
          participantId,
        },
      },
      include: {
        participant: true,
      },
    });

    if (!assignment) {
      throw new ForbiddenException('Judge is not assigned to view this participant.');
    }

    const criteria = await this.prisma.judgingCriterion.findMany({
      where: { competitionId: competition.id, isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        weight: true,
        maxScore: true,
      },
    });

    const judgeScores = await this.prisma.judgeScore.findMany({
      where: { judgeId, participantId },
    });

    const scoreMap = new Map<string, any>(judgeScores.map((s) => [s.criterionId, s]));

    const assignedCriteria = criteria.map((c) => {
      const existingScore = scoreMap.get(c.id);
      return {
        id: c.id,
        name: c.name,
        description: c.description,
        weight: c.weight,
        maxScore: c.maxScore,
        currentScore: existingScore ? existingScore.score : null,
        comment: existingScore ? existingScore.comment : null,
      };
    });

    return {
      participant: {
        id: assignment.participant.id,
        poetryTitle: assignment.participant.poetryTitle,
        language: assignment.participant.language,
        performanceType: assignment.participant.performanceType,
        description: assignment.participant.description,
      },
      criteria: assignedCriteria,
      competitionStatus: competition.status,
    };
  }
}
