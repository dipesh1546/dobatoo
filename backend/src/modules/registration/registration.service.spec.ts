import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { RegistrationService } from './registration.service';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../../mail/mail.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { ParticipationType, DiscoverySource } from '@prisma/client';

describe('RegistrationService (Open Mic)', () => {
  let service: RegistrationService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mailService: MailService;

  const mockActiveEvent = {
    id: 'evt-123',
    title: 'DOBATO GRAND LAUNCH',
    slug: 'dobato-grand-launch',
    eventDate: new Date('2026-10-16T00:00:00+05:45'),
    isRegistrationOpen: true,
    isActive: true,
    registrationFee: 0,
    poetryCompetitions: [
      { id: 'comp-1', title: 'DOBATO Poetry Competition', isOpen: true },
    ],
  };

  const validAttendOnlyDto: CreateRegistrationDto = {
    fullName: 'Anil Shrestha',
    email: 'anil@example.com',
    phone: '+9779841234567',
    gender: 'MALE',
    participationType: ParticipationType.ATTEND_ONLY,
    discoverySource: DiscoverySource.INSTAGRAM,
    mediaAgreement: true,
  };

  const mockPrismaService = {
    event: {
      findFirst: jest.fn(),
    },
    registration: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    poetryParticipant: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockMailService = {
    sendConfirmationEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<RegistrationService>(RegistrationService);
    mailService = module.get<MailService>(MailService);
    jest.clearAllMocks();
  });

  describe('createRegistration', () => {
    it('1. Secure token generated, stored as hash, and raw token returned in response', async () => {
      mockPrismaService.event.findFirst.mockResolvedValue(mockActiveEvent);
      mockPrismaService.registration.findFirst.mockResolvedValue(null);
      mockMailService.sendConfirmationEmail.mockResolvedValue(true);

      let capturedHash = '';
      mockPrismaService.$transaction.mockImplementation(async (cb) => {
        const tx = {
          registration: {
            count: jest.fn().mockResolvedValue(0),
            findUnique: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockImplementation((args) => {
              capturedHash = args.data.verificationTokenHash;
              return {
                id: 'reg-1',
                registrationId: 'DBT-2026-000001',
                participationType: ParticipationType.ATTEND_ONLY,
                verificationTokenHash: capturedHash,
              };
            }),
          },
        };
        return cb(tx);
      });

      const result = await service.createRegistration(validAttendOnlyDto);

      expect(result.verificationToken).toBeDefined();
      expect(result.verificationToken.length).toBe(64); // 32 bytes hex
      expect(capturedHash).toBeDefined();
      expect(capturedHash).not.toBe(result.verificationToken);

      const expectedHash = crypto
        .createHash('sha256')
        .update(result.verificationToken)
        .digest('hex');
      expect(capturedHash).toBe(expectedHash);
    });

    it('2. Enforces fixed poetry topic DOBATO', async () => {
      mockPrismaService.event.findFirst.mockResolvedValue(mockActiveEvent);
      mockPrismaService.registration.findFirst.mockResolvedValue(null);

      const invalidTopicDto: any = {
        ...validAttendOnlyDto,
        participationType: ParticipationType.ATTEND_AND_POETRY,
        stageIntroductionName: 'Performer Anil',
        topic: 'Arbitrary Other Topic',
      };

      await expect(service.createRegistration(invalidTopicDto)).rejects.toThrow();
    });
  });

  describe('verifyRegistrationToken', () => {
    it('returns validity for existing token hash', async () => {
      const rawToken = 'abcdef1234567890abcdef1234567890';
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

      mockPrismaService.registration.findUnique.mockResolvedValue({
        id: 'reg-1',
        registrationId: 'DBT-2026-000001',
        participationType: ParticipationType.ATTEND_ONLY,
        status: 'REGISTERED',
      });

      const result = await service.verifyRegistrationToken(rawToken);
      expect(result.valid).toBe(true);
      expect(result.registrationId).toBe('DBT-2026-000001');
    });

    it('throws NotFoundException for non-existent token', async () => {
      mockPrismaService.registration.findUnique.mockResolvedValue(null);
      await expect(
        service.verifyRegistrationToken('nonexistenttoken1234567890'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
