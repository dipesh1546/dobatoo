import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { AdminService } from './admin.service';
import { AdminAuditService } from './admin-audit.service';
import { PrismaService } from '../../database/prisma.service';
import { Role } from '@prisma/client';

describe('AdminService (Open Mic)', () => {
  let service: AdminService;

  const mockHashedPassword = bcrypt.hashSync('AdminSecret@2026', 10);

  const mockAdminUser = {
    id: 'admin-uuid-1',
    name: 'DOBATO Super Admin',
    email: 'superadmin@dobato.app',
    passwordHash: mockHashedPassword,
    role: Role.SUPER_ADMIN,
    isActive: true,
  };

  const mockPrismaService = {
    adminUser: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    event: {
      findFirst: jest.fn(),
    },
    registration: {
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    poetryParticipant: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mock_jwt_token_12345'),
  };

  const mockAuditService = {
    logAction: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-jwt-secret-key-2026'),
          },
        },
        { provide: AdminAuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('authenticates valid credentials and generates JWT', async () => {
      mockPrismaService.adminUser.findUnique.mockResolvedValue(mockAdminUser);
      mockPrismaService.adminUser.update.mockResolvedValue(mockAdminUser);

      const result = await service.login({
        email: 'superadmin@dobato.app',
        password: 'AdminSecret@2026',
      });

      expect(result.accessToken).toBe('mock_jwt_token_12345');
      expect(result.admin.email).toBe('superadmin@dobato.app');
    });

    it('rejects invalid password with UnauthorizedException', async () => {
      mockPrismaService.adminUser.findUnique.mockResolvedValue(mockAdminUser);

      await expect(
        service.login({
          email: 'superadmin@dobato.app',
          password: 'WrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getDashboardStats', () => {
    it('returns open mic metrics correctly', async () => {
      mockPrismaService.event.findFirst.mockResolvedValue({
        id: 'evt-1',
        isRegistrationOpen: true,
        eventDate: new Date('2026-10-16'),
      });
      mockPrismaService.registration.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(70)  // attend only
        .mockResolvedValueOnce(30); // attend and perform

      mockPrismaService.poetryParticipant.count
        .mockResolvedValueOnce(20) // poetry
        .mockResolvedValueOnce(5)  // music
        .mockResolvedValueOnce(3)  // storytelling
        .mockResolvedValueOnce(2); // other

      mockPrismaService.registration.findMany.mockResolvedValue([]);

      const result = await service.getDashboardStats();

      expect(result.totalRegistrations).toBe(100);
      expect(result.attendOnly).toBe(70);
      expect(result.poetryParticipants).toBe(20);
      expect(result.musicParticipants).toBe(5);
    });
  });

  describe('getAdminUsers', () => {
    it('returns list of admin accounts', async () => {
      mockPrismaService.adminUser.findMany.mockResolvedValue([
        {
          id: 'admin-1',
          name: 'Super Admin',
          email: 'admin@dobato.app',
          role: Role.SUPER_ADMIN,
          isActive: true,
        },
      ]);

      const users = await service.getAdminUsers();
      expect(users.length).toBe(1);
      expect(users[0].email).toBe('admin@dobato.app');
    });
  });
});
