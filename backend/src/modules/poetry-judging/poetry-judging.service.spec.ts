import { Test, TestingModule } from '@nestjs/testing';
import { PoetryJudgingService } from './poetry-judging.service';
import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminAuditService } from '../admin/admin-audit.service';
import { CompetitionStatus } from '@prisma/client';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('PoetryJudgingService (Phase 7)', () => {
  let service: PoetryJudgingService;

  const mockAdminId = 'super-admin-uuid-1';
  const mockJudgeId = 'judge-uuid-1';
  const mockParticipantId = 'participant-uuid-1';
  const mockCompetitionId = 'competition-uuid-1';
  const mockCriterionId = 'criterion-uuid-1';
  const validPasswordHash = bcrypt.hashSync('SecretPassword123', 10);

  const mockCompetition = {
    id: mockCompetitionId,
    eventId: 'event-uuid-1',
    title: 'DOBATO Poetry Contest',
    theme: 'Two Paths',
    description: 'Launch Contest',
    status: CompetitionStatus.DRAFT,
    isOpen: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockJudge = {
    id: mockJudgeId,
    name: 'Dr. Maya Sharma',
    email: 'judge.maya@dobato.app',
    passwordHash: validPasswordHash,
    role: 'JUDGE',
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    poetryCompetition: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    judge: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    poetryParticipant: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    poetryJudgeAssignment: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    judgingCriterion: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    judgeScore: {
      upsert: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
    poetryWinner: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    prize: {
      findMany: jest.fn(),
    },
    event: {
      findFirst: jest.fn(),
    },
    $transaction: jest.fn((cb) => (typeof cb === 'function' ? cb(mockPrismaService) : Promise.all(cb))),
  };

  const mockAuditService = {
    logAction: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_judge_jwt_token'),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('mock_jwt_secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoetryJudgingService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AdminAuditService, useValue: mockAuditService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<PoetryJudgingService>(PoetryJudgingService);
    jest.clearAllMocks();
  });

  describe('Judge Creation & Login', () => {
    it('should create a new judge account with hashed password', async () => {
      mockPrismaService.judge.findUnique.mockResolvedValue(null);
      mockPrismaService.judge.create.mockResolvedValue(mockJudge);

      const result = await service.createJudge(
        { name: 'Dr. Maya Sharma', email: 'judge.maya@dobato.app', password: 'SecretPassword123' },
        mockAdminId,
      );

      expect(result.name).toBe('Dr. Maya Sharma');
      expect(mockAuditService.logAction).toHaveBeenCalledWith(
        expect.objectContaining({
          adminId: mockAdminId,
          action: 'JUDGE_CREATED',
          entityType: 'Judge',
          entityId: mockJudgeId,
        }),
      );
    });

    it('should throw ConflictException if judge email already exists', async () => {
      mockPrismaService.judge.findUnique.mockResolvedValue(mockJudge);

      await expect(
        service.createJudge(
          { name: 'Dr. Maya', email: 'judge.maya@dobato.app', password: 'SecretPassword123' },
          mockAdminId,
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('should authenticate judge with valid credentials and return JWT token', async () => {
      mockPrismaService.judge.findUnique.mockResolvedValue(mockJudge);
      mockPrismaService.judge.update.mockResolvedValue(mockJudge);

      const result = await service.loginJudge({
        email: 'judge.maya@dobato.app',
        password: 'SecretPassword123',
      });

      expect(result.accessToken).toBe('mock_judge_jwt_token');
      expect(result.judge.email).toBe('judge.maya@dobato.app');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockPrismaService.judge.findUnique.mockResolvedValue(mockJudge);

      await expect(
        service.loginJudge({
          email: 'judge.maya@dobato.app',
          password: 'WrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('Judge Assignments', () => {
    it('should assign a judge to a poetry participant', async () => {
      mockPrismaService.poetryCompetition.findFirst.mockResolvedValue(mockCompetition);
      mockPrismaService.judge.findUnique.mockResolvedValue(mockJudge);
      mockPrismaService.poetryParticipant.findUnique.mockResolvedValue({ id: mockParticipantId });
      mockPrismaService.poetryJudgeAssignment.findUnique.mockResolvedValue(null);
      mockPrismaService.poetryJudgeAssignment.create.mockResolvedValue({
        id: 'assignment-1',
        judgeId: mockJudgeId,
        participantId: mockParticipantId,
      });

      const result = await service.assignJudge(mockJudgeId, mockParticipantId, mockAdminId);

      expect(result.id).toBe('assignment-1');
      expect(mockAuditService.logAction).toHaveBeenCalledWith(
        expect.objectContaining({
          adminId: mockAdminId,
          action: 'JUDGE_ASSIGNED',
          entityType: 'PoetryJudgeAssignment',
          entityId: 'assignment-1',
        }),
      );
    });

    it('should reject duplicate judge assignment', async () => {
      mockPrismaService.poetryCompetition.findFirst.mockResolvedValue(mockCompetition);
      mockPrismaService.judge.findUnique.mockResolvedValue(mockJudge);
      mockPrismaService.poetryParticipant.findUnique.mockResolvedValue({ id: mockParticipantId });
      mockPrismaService.poetryJudgeAssignment.findUnique.mockResolvedValue({ id: 'assignment-1' });

      await expect(
        service.assignJudge(mockJudgeId, mockParticipantId, mockAdminId),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('Competition State Machine & Weight Validation', () => {
    it('should transition status from DRAFT to OPEN', async () => {
      mockPrismaService.poetryCompetition.findFirst.mockResolvedValue(mockCompetition);
      mockPrismaService.poetryCompetition.update.mockResolvedValue({
        ...mockCompetition,
        status: CompetitionStatus.OPEN,
      });

      const result = await service.updateCompetitionStatus(
        { status: CompetitionStatus.OPEN },
        mockAdminId,
      );

      expect(result.status).toBe(CompetitionStatus.OPEN);
    });

    it('should fail transition to JUDGING if criteria weights do not sum to 100%', async () => {
      mockPrismaService.poetryCompetition.findFirst.mockResolvedValue({
        ...mockCompetition,
        status: CompetitionStatus.OPEN,
      });

      mockPrismaService.judgingCriterion.findMany.mockResolvedValue([
        { id: 'c1', name: 'Originality', weight: 40, maxScore: 10, isActive: true },
        { id: 'c2', name: 'Expression', weight: 40, maxScore: 10, isActive: true },
      ]);

      await expect(
        service.updateCompetitionStatus({ status: CompetitionStatus.JUDGING }, mockAdminId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow transition to JUDGING when criteria weights sum to 100%', async () => {
      mockPrismaService.poetryCompetition.findFirst.mockResolvedValue({
        ...mockCompetition,
        status: CompetitionStatus.OPEN,
      });

      mockPrismaService.judgingCriterion.findMany.mockResolvedValue([
        { id: 'c1', name: 'Originality', weight: 50, maxScore: 10, isActive: true },
        { id: 'c2', name: 'Expression', weight: 50, maxScore: 10, isActive: true },
      ]);

      mockPrismaService.poetryCompetition.update.mockResolvedValue({
        ...mockCompetition,
        status: CompetitionStatus.JUDGING,
      });

      const result = await service.updateCompetitionStatus(
        { status: CompetitionStatus.JUDGING },
        mockAdminId,
      );

      expect(result.status).toBe(CompetitionStatus.JUDGING);
    });

    it('should prevent backwards status transitions', async () => {
      mockPrismaService.poetryCompetition.findFirst.mockResolvedValue({
        ...mockCompetition,
        status: CompetitionStatus.JUDGING,
      });

      await expect(
        service.updateCompetitionStatus({ status: CompetitionStatus.OPEN }, mockAdminId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Score Submissions & Validation', () => {
    it('should reject score submission if judge is not assigned', async () => {
      mockPrismaService.poetryCompetition.findFirst.mockResolvedValue({
        ...mockCompetition,
        status: CompetitionStatus.JUDGING,
      });

      mockPrismaService.poetryJudgeAssignment.findUnique.mockResolvedValue(null);

      await expect(
        service.submitScores(mockJudgeId, mockParticipantId, {
          scores: [{ criterionId: mockCriterionId, score: 8 }],
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should reject score submission if score exceeds maxScore', async () => {
      mockPrismaService.poetryCompetition.findFirst.mockResolvedValue({
        ...mockCompetition,
        status: CompetitionStatus.JUDGING,
      });

      mockPrismaService.poetryJudgeAssignment.findUnique.mockResolvedValue({ id: 'ass-1' });
      mockPrismaService.judgingCriterion.findMany.mockResolvedValue([
        { id: mockCriterionId, name: 'Originality', maxScore: 10, isActive: true },
      ]);

      await expect(
        service.submitScores(mockJudgeId, mockParticipantId, {
          scores: [{ criterionId: mockCriterionId, score: 15 }],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should submit and upsert scores successfully during JUDGING state', async () => {
      mockPrismaService.poetryCompetition.findFirst.mockResolvedValue({
        ...mockCompetition,
        status: CompetitionStatus.JUDGING,
      });

      mockPrismaService.poetryJudgeAssignment.findUnique.mockResolvedValue({ id: 'ass-1' });
      mockPrismaService.judgingCriterion.findMany.mockResolvedValue([
        { id: mockCriterionId, name: 'Originality', maxScore: 10, isActive: true },
      ]);

      mockPrismaService.judgeScore.upsert.mockResolvedValue({
        id: 'score-1',
        score: 8.5,
      });

      const result = await service.submitScores(mockJudgeId, mockParticipantId, {
        scores: [{ criterionId: mockCriterionId, score: 8.5, comment: 'Great effort' }],
      });

      expect(result.message).toBe('Scores submitted successfully.');
      expect(result.count).toBe(1);
    });

    it('should reject score modifications when competition is in FINAL_REVIEW or FINALIZED', async () => {
      mockPrismaService.poetryCompetition.findFirst.mockResolvedValue({
        ...mockCompetition,
        status: CompetitionStatus.FINAL_REVIEW,
      });

      await expect(
        service.submitScores(mockJudgeId, mockParticipantId, {
          scores: [{ criterionId: mockCriterionId, score: 8.5 }],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Winner Selection & Finalization Locking', () => {
    it('should select winners in FINAL_REVIEW state and map prizes', async () => {
      mockPrismaService.poetryCompetition.findFirst.mockResolvedValue({
        ...mockCompetition,
        status: CompetitionStatus.FINAL_REVIEW,
      });

      mockPrismaService.prize.findMany.mockResolvedValue([
        { position: 1, title: 'First Prize', cashAmount: 2500, currency: 'NPR' },
        { position: 2, title: 'Second Prize', cashAmount: 1000, currency: 'NPR' },
        { position: 3, title: 'Third Prize', cashAmount: null, currency: 'NPR' },
      ]);

      mockPrismaService.poetryParticipant.findMany.mockResolvedValue([]);
      mockPrismaService.poetryParticipant.findUnique.mockResolvedValue({
        id: 'p1',
        poetryTitle: 'Test Poem',
        registration: { fullName: 'Winner 1', registrationId: 'DBT-001' },
      });

      mockPrismaService.poetryWinner.create.mockImplementation(({ data }) => ({
        id: `w-${data.position}`,
        position: data.position,
        participantId: data.participantId,
        score: 90,
        participant: {
          poetryTitle: 'Test Poem',
          registration: { fullName: `Winner ${data.position}`, registrationId: `DBT-00${data.position}` },
        },
      }));

      const result = await service.selectWinners(
        {
          winners: [
            { position: 1, participantId: 'p1' },
            { position: 2, participantId: 'p2' },
            { position: 3, participantId: 'p3' },
          ],
        },
        mockAdminId,
      );

      expect(result.message).toBe('Winners selected successfully.');
      expect(result.winners.length).toBe(3);
    });

    it('should finalize competition and lock all future changes', async () => {
      mockPrismaService.poetryCompetition.findFirst.mockResolvedValue({
        ...mockCompetition,
        status: CompetitionStatus.FINAL_REVIEW,
      });

      mockPrismaService.poetryWinner.findMany.mockResolvedValue([
        { id: 'w1', position: 1 },
        { id: 'w2', position: 2 },
        { id: 'w3', position: 3 },
      ]);

      mockPrismaService.poetryCompetition.update.mockResolvedValue({
        ...mockCompetition,
        status: CompetitionStatus.FINALIZED,
        finalizedAt: new Date(),
      });

      const result = await service.finalizeCompetition(mockAdminId);

      expect(result.message).toBe('Competition successfully finalized and locked.');
      expect(result.competition.status).toBe(CompetitionStatus.FINALIZED);
      expect(mockAuditService.logAction).toHaveBeenCalledWith(
        expect.objectContaining({
          adminId: mockAdminId,
          action: 'RESULTS_FINALIZED',
          entityType: 'PoetryCompetition',
          entityId: mockCompetitionId,
        }),
      );
    });
  });
});
