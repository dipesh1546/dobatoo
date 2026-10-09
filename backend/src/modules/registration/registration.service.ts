import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../../mail/mail.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import {
  RegistrationSuccessDataDto,
  VerificationResultDataDto,
} from './dto/registration-response.dto';
import { ParticipationType, DiscoverySource, PerformanceType, Prisma } from '@prisma/client';

export const FIXED_POETRY_TOPIC = 'DOBATO';

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(RegistrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Register a participant for the active DOBATO open mic event.
   * Generates a cryptographically secure verification token, stores its hash,
   * enforces fixed topic "DOBATO", dispatches confirmation email asynchronously,
   * and returns privacy-safe confirmation data.
   */
  async createRegistration(
    dto: CreateRegistrationDto,
  ): Promise<RegistrationSuccessDataDto> {
    // 1. Fetch Active Event
    const event = await this.prisma.event.findFirst({
      where: { isActive: true },
      include: {
        poetryCompetitions: {
          where: { isOpen: true },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Active event not found');
    }

    // 2. Validate Event Status & Registration Fee
    if (!event.isRegistrationOpen) {
      throw new ConflictException('Registration for this event is currently closed.');
    }

    if (Number(event.registrationFee) !== 0) {
      throw new BadRequestException('Event registration fee requirement mismatch');
    }

    // 3. Media Agreement Validation
    if (dto.mediaAgreement !== true) {
      throw new BadRequestException(
        'By submitting form, you agree that DOBATO may use photographs/videos of your participation for promotional purposes.',
      );
    }

    // 4. Discovery Source Validation
    if (dto.discoverySource === DiscoverySource.OTHERS || (dto.discoverySource as string) === 'OTHERS') {
      if (!dto.discoverySourceOther || !dto.discoverySourceOther.trim()) {
        throw new BadRequestException(
          'Please specify how you found out about the event when selecting OTHERS',
        );
      }
    }

    // 5. Poetry Topic Validation - Fixed to DOBATO
    const rawTopic = dto.topic || dto.poetry?.topic;
    if (rawTopic && rawTopic.trim().toUpperCase() !== FIXED_POETRY_TOPIC) {
      throw new BadRequestException(
        `Invalid poetry topic "${rawTopic}". The only accepted topic is "${FIXED_POETRY_TOPIC}".`,
      );
    }

    // 6. Conditional Performance & Stage Introduction Validation
    let activeCompetitionId: string | null = null;
    let stageIntroName: string | null = null;
    let effectivePerformanceType: PerformanceType | null = null;
    let performanceDesc: string | null = null;

    if (dto.participationType === ParticipationType.ATTEND_AND_POETRY) {
      stageIntroName =
        dto.stageIntroductionName?.trim() ||
        dto.stageName?.trim() ||
        dto.poetry?.title?.trim() ||
        null;

      if (!stageIntroName) {
        throw new BadRequestException(
          'Stage introduction name or performance title is required when participating in performance/poetry',
        );
      }

      effectivePerformanceType =
        dto.performanceType || dto.poetry?.performanceType || PerformanceType.POETRY;

      performanceDesc =
        dto.performanceDescription?.trim() || dto.poetry?.description?.trim() || null;

      if (!event.poetryCompetitions || event.poetryCompetitions.length === 0) {
        throw new ConflictException(
          'Poetry/Open Mic competition is currently closed for registration.',
        );
      }

      activeCompetitionId = event.poetryCompetitions[0].id;
    } else if (dto.participationType === ParticipationType.ATTEND_ONLY) {
      stageIntroName = null;
      effectivePerformanceType = null;
      performanceDesc = null;
    }

    // 7. Duplicate Check (Email & Phone per Event)
    const normalizedEmail = dto.email.trim().toLowerCase();
    const normalizedPhone = dto.phone.trim();

    const existingRegistration = await this.prisma.registration.findFirst({
      where: {
        eventId: event.id,
        OR: [{ email: normalizedEmail }, { phone: normalizedPhone }],
      },
    });

    if (existingRegistration) {
      this.logger.warn(`Duplicate registration attempt blocked for event ${event.id}`);
      throw new ConflictException('This email or phone number is already registered.');
    }

    // 8. Extract Marketing / UTM Discovery Attribution
    const source =
      dto.utmSource?.trim() ||
      dto.utm_source?.trim() ||
      (dto.discoverySource ? String(dto.discoverySource) : 'DIRECT');
    const medium = dto.utmMedium?.trim() || dto.utm_medium?.trim() || null;
    const campaign = dto.utmCampaign?.trim() || dto.utm_campaign?.trim() || null;
    const content = dto.utmContent?.trim() || dto.utm_content?.trim() || null;
    const term = dto.utmTerm?.trim() || dto.utm_term?.trim() || null;

    // 9. Generate Cryptographically Secure Verification Token & Hash
    const rawToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    // 10. Execute Atomic Database Registration Creation
    let registration: any;
    try {
      registration = await this.prisma.$transaction(async (tx) => {
        // Generate human-readable DBT-2026-XXXXXX registrationId with collision loop
        let registrationId = '';
        let isUnique = false;
        let attempts = 0;

        const totalCount = await tx.registration.count({ where: { eventId: event.id } });
        let nextSeq = totalCount + 1;

        while (!isUnique && attempts < 10) {
          registrationId = `DBT-2026-${String(nextSeq).padStart(6, '0')}`;
          const existing = await tx.registration.findUnique({ where: { registrationId } });
          if (!existing) {
            isUnique = true;
          } else {
            nextSeq += Math.floor(Math.random() * 10) + 1;
            attempts++;
          }
        }

        const newRegistration = await tx.registration.create({
          data: {
            registrationId,
            eventId: event.id,
            fullName: dto.fullName.trim(),
            email: normalizedEmail,
            phone: normalizedPhone,
            age: dto.age ?? null,
            city: dto.city ? dto.city.trim() : null,
            gender: dto.gender ? dto.gender.trim() : null,
            participationType: dto.participationType,
            discoverySource: dto.discoverySource,
            discoverySourceOther: dto.discoverySourceOther ? dto.discoverySourceOther.trim() : null,
            stageIntroductionName: stageIntroName,
            mediaAgreement: true,
            status: 'REGISTERED',
            verificationTokenHash,
            verificationTokenCreatedAt: new Date(),
            source,
            medium,
            campaign,
            content,
            term,
          },
        });

        if (
          dto.participationType === ParticipationType.ATTEND_AND_POETRY &&
          stageIntroName
        ) {
          await tx.poetryParticipant.create({
            data: {
              registrationId: newRegistration.id,
              competitionId: activeCompetitionId,
              poetryTitle: stageIntroName,
              topic: FIXED_POETRY_TOPIC,
              language: dto.poetryLanguage || dto.poetry?.language || 'NEPALI',
              performanceType: effectivePerformanceType || PerformanceType.POETRY,
              description: performanceDesc,
            },
          });
        }

        return newRegistration;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'This email or phone number is already registered.',
          );
        }
      }
      throw error;
    }

    // 11. Dispatch Confirmation Email Asynchronously (Non-blocking failure)
    const eventDateStr = event.eventDate
      ? event.eventDate.toISOString().split('T')[0]
      : '2026-10-16';

    let emailSent = false;
    try {
      emailSent = await this.mailService.sendConfirmationEmail({
        toEmail: normalizedEmail,
        fullName: dto.fullName.trim(),
        registrationId: registration.registrationId,
        participationType: registration.participationType,
        eventTitle: event.title,
        eventDate: eventDateStr,
        poetryTitle: stageIntroName || dto.poetry?.title,
      });

      // Update email delivery status record silently in background
      await this.prisma.registration.update({
        where: { id: registration.id },
        data: {
          emailSent,
          emailSentAt: emailSent ? new Date() : null,
          emailFailureReason: emailSent ? null : 'SMTP transport unavailable',
        },
      });
    } catch (mailError) {
      this.logger.warn(
        `Email confirmation warning for ${registration.registrationId}: ${
          mailError instanceof Error ? mailError.message : String(mailError)
        }`,
      );
      emailSent = false;
    }

    // Return ONLY privacy-safe confirmation data (NO PII)
    return {
      registrationId: registration.registrationId,
      verificationToken: rawToken,
      event: {
        title: event.title,
        date: eventDateStr,
      },
      participationType: registration.participationType,
      emailSent,
    };
  }

  /**
   * Verify an event pass token for identification / confirmation.
   */
  async verifyRegistrationToken(rawTokenInput: string): Promise<VerificationResultDataDto> {
    if (!rawTokenInput || typeof rawTokenInput !== 'string') {
      throw new NotFoundException('Invalid or expired event pass.');
    }

    let token = rawTokenInput.trim();
    if (token.startsWith('DOBATO_CHECKIN:')) {
      token = token.replace('DOBATO_CHECKIN:', '').trim();
    }

    if (!token || token.length < 10) {
      throw new NotFoundException('Invalid or expired event pass.');
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const registration = await this.prisma.registration.findUnique({
      where: { verificationTokenHash: tokenHash },
    });

    if (!registration || registration.status === 'CANCELLED') {
      throw new NotFoundException('Invalid or expired event pass.');
    }

    return {
      valid: true,
      registrationId: registration.registrationId,
      participationType: registration.participationType,
      checkedIn: false,
    };
  }
}
