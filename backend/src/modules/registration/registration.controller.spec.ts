import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { ParticipationType, DiscoverySource } from '@prisma/client';

describe('RegistrationController (Phase 5)', () => {
  let controller: RegistrationController;

  const mockRegistrationResponse = {
    registrationId: 'DBT-2026-000001',
    verificationToken: 'a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef',
    event: {
      title: 'DOBATO GRAND LAUNCH',
      date: '2026-10-16',
    },
    participationType: ParticipationType.ATTEND_ONLY,
    emailSent: true,
  };

  const mockVerificationResponse = {
    valid: true,
    registrationId: 'DBT-2026-000001',
    participationType: ParticipationType.ATTEND_ONLY,
    checkedIn: false,
  };

  const mockRegistrationService = {
    createRegistration: jest.fn(),
    verifyRegistrationToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationController],
      providers: [
        { provide: RegistrationService, useValue: mockRegistrationService },
      ],
    }).compile();

    controller = module.get<RegistrationController>(RegistrationController);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should return verificationToken and emailSent status without exposing PII', async () => {
      mockRegistrationService.createRegistration.mockResolvedValue(
        mockRegistrationResponse,
      );

      const dto: CreateRegistrationDto = {
        fullName: 'Anil Shrestha',
        email: 'anil@example.com',
        phone: '+9779841234567',
        participationType: ParticipationType.ATTEND_ONLY,
        discoverySource: DiscoverySource.INSTAGRAM,
        mediaAgreement: true,
      };

      const result = await controller.register(dto);

      expect(result.message).toBe('Registration completed successfully.');
      expect(result.data.registrationId).toBe('DBT-2026-000001');
      expect(result.data.verificationToken).toBe(mockRegistrationResponse.verificationToken);
      expect(result.data.emailSent).toBe(true);
      expect(result.data).not.toHaveProperty('email');
      expect(result.data).not.toHaveProperty('phone');
    });
  });

  describe('verify', () => {
    it('should return token verification validity result without exposing PII', async () => {
      mockRegistrationService.verifyRegistrationToken.mockResolvedValue(
        mockVerificationResponse,
      );

      const result = await controller.verify({
        token: 'DOBATO_CHECKIN:a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef',
      });

      expect(result.message).toBe('Registration is valid.');
      expect(result.data.valid).toBe(true);
      expect(result.data.registrationId).toBe('DBT-2026-000001');
      expect(result.data.checkedIn).toBe(false);
      expect(result.data).not.toHaveProperty('email');
      expect(result.data).not.toHaveProperty('phone');
    });
  });
});
