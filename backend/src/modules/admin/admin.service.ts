import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ServiceUnavailableException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { AdminAuditService } from './admin-audit.service';
import { AdminLoginDto, AdminLoginResponseDto, AdminProfileDto } from './dto/admin-auth.dto';
import { AdminRegistrationQueryDto, AdminPoetryQueryDto } from './dto/admin-query.dto';
import {
  AdminCreateRegistrationDto,
  AdminUpdateRegistrationDto,
} from './dto/admin-registration.dto';
import {
  CreateAdminUserDto,
  UpdateAdminUserDto,
} from './dto/admin-user.dto';
import {
  AuditAction,
  ParticipationType,
  PerformanceType,
  Role,
  Prisma,
} from '@prisma/client';

export const FIXED_POETRY_TOPIC = 'DOBATO';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditService: AdminAuditService,
  ) {}

  // -------------------------------------------------------------------
  // 1. Admin Authentication & Profile
  // -------------------------------------------------------------------

  async login(dto: AdminLoginDto): Promise<AdminLoginResponseDto> {
    const email = dto.email.toLowerCase().trim();
    this.logger.log(`[Admin Login] Step 1: Request received for ${email}`);

    this.logger.log(`[Admin Login] Step 2: Looking up admin record for ${email}`);
    let adminUser;
    try {
      adminUser = await this.prisma.adminUser.findUnique({
        where: { email },
      });
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `[Admin Login] Database error during admin lookup for ${email}: ${errMessage}`,
      );
      throw new ServiceUnavailableException(
        'Database connection unavailable. Please ensure your IP address is whitelisted in MongoDB Atlas Network Access.',
      );
    }

    if (!adminUser || !adminUser.isActive) {
      this.logger.warn(`[Admin Login] Admin user not found or inactive: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    this.logger.log(`[Admin Login] Step 3: Verifying password for ${email}`);
    const isPasswordValid = await bcrypt.compare(dto.password, adminUser.passwordHash);
    if (!isPasswordValid) {
      this.logger.warn(`[Admin Login] Password verification failed for: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last login timestamp
    try {
      await this.prisma.adminUser.update({
        where: { id: adminUser.id },
        data: { lastLoginAt: new Date() },
      });
    } catch (error) {
      this.logger.warn(
        `[Admin Login] Could not update last login timestamp: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    this.logger.log(`[Admin Login] Step 4: Generating JWT for admin ID: ${adminUser.id}, Role: ${adminUser.role}`);
    const jwtSecret =
      this.configService.get<string>('jwtSecret') ||
      this.configService.get<string>('JWT_SECRET') ||
      'dobato_secret_jwt_key_2026_super_secure';

    const accessToken = await this.jwtService.signAsync(
      {
        sub: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      },
      { secret: jwtSecret, expiresIn: '24h' },
    );

    // Audit Log
    try {
      await this.auditService.logAction({
        adminId: adminUser.id,
        action: AuditAction.LOGIN,
        entityType: 'AdminUser',
        entityId: adminUser.id,
      });
    } catch (auditError) {
      this.logger.warn(
        `[Admin Login] Could not write audit log: ${
          auditError instanceof Error ? auditError.message : auditError
        }`,
      );
    }

    this.logger.log(`[Admin Login] Step 5: Response created successfully for ${email}`);
    return {
      accessToken,
      admin: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    };
  }

  async getMe(adminId: string): Promise<AdminProfileDto> {
    const adminUser = await this.prisma.adminUser.findUnique({
      where: { id: adminId },
    });

    if (!adminUser || !adminUser.isActive) {
      throw new UnauthorizedException('Admin user not found or inactive');
    }

    return {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
    };
  }

  async logout(adminId: string): Promise<{ message: string }> {
    await this.auditService.logAction({
      adminId,
      action: AuditAction.LOGOUT,
      entityType: 'AdminUser',
      entityId: adminId,
    });
    return { message: 'Logout successful.' };
  }

  // -------------------------------------------------------------------
  // 2. Admin User Management APIs (RBAC)
  // -------------------------------------------------------------------

  async getAdminUsers() {
    return this.prisma.adminUser.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createAdminUser(dto: CreateAdminUserDto) {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.prisma.adminUser.findUnique({
      where: { email },
    });

    if (existing) {
      throw new ConflictException('An administrator with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const userRole = dto.role || Role.EVENT_ADMIN;

    const created = await this.prisma.adminUser.create({
      data: {
        name: dto.name.trim(),
        email,
        passwordHash,
        role: userRole,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return created;
  }

  async updateAdminUser(id: string, dto: UpdateAdminUserDto) {
    const existing = await this.prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Admin user "${id}" not found`);
    }

    const data: Prisma.AdminUserUpdateInput = {};

    if (dto.name) {
      data.name = dto.name.trim();
    }

    if (dto.email && dto.email.toLowerCase().trim() !== existing.email) {
      const email = dto.email.toLowerCase().trim();
      const conflict = await this.prisma.adminUser.findUnique({
        where: { email },
      });
      if (conflict) {
        throw new ConflictException('Email already in use by another admin user.');
      }
      data.email = email;
    }

    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    if (dto.role) {
      data.role = dto.role;
    }

    if (typeof dto.isActive === 'boolean') {
      data.isActive = dto.isActive;
    }

    const updated = await this.prisma.adminUser.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  async updateAdminUserStatus(id: string, isActive: boolean) {
    const existing = await this.prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Admin user "${id}" not found`);
    }

    return this.prisma.adminUser.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }

  // -------------------------------------------------------------------
  // 3. Simplified Open Mic Dashboard Statistics
  // -------------------------------------------------------------------

  async getDashboardStats() {
    const activeEvent = await this.prisma.event.findFirst({
      where: { isActive: true },
    });

    const eventId = activeEvent?.id;
    const filter = eventId ? { eventId } : {};

    const [
      totalRegistrations,
      attendOnly,
      attendAndPoetry,
      poetryCount,
      musicCount,
      storytellingCount,
      otherCount,
      recentRegistrations,
    ] = await Promise.all([
      this.prisma.registration.count({ where: filter }),
      this.prisma.registration.count({
        where: { ...filter, participationType: ParticipationType.ATTEND_ONLY },
      }),
      this.prisma.registration.count({
        where: { ...filter, participationType: ParticipationType.ATTEND_AND_POETRY },
      }),
      this.prisma.poetryParticipant.count({
        where: { performanceType: PerformanceType.POETRY },
      }),
      this.prisma.poetryParticipant.count({
        where: { performanceType: PerformanceType.MUSIC },
      }),
      this.prisma.poetryParticipant.count({
        where: { performanceType: PerformanceType.STORY_TELLING },
      }),
      this.prisma.poetryParticipant.count({
        where: { performanceType: PerformanceType.OTHER },
      }),
      this.prisma.registration.findMany({
        where: filter,
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          registrationId: true,
          fullName: true,
          email: true,
          phone: true,
          participationType: true,
          status: true,
          createdAt: true,
          poetryParticipant: {
            select: {
              poetryTitle: true,
              performanceType: true,
              topic: true,
            },
          },
        },
      }),
    ]);

    const totalPerformers = poetryCount + musicCount + storytellingCount + otherCount;

    return {
      totalRegistrations,
      attendOnly,
      attendAndPoetry,
      attendAndPerform: attendAndPoetry,
      totalPerformers,
      poetryParticipants: poetryCount,
      musicParticipants: musicCount,
      storytellingParticipants: storytellingCount,
      otherParticipants: otherCount,
      performanceDistribution: {
        POETRY: poetryCount,
        MUSIC: musicCount,
        STORY_TELLING: storytellingCount,
        OTHER: otherCount,
      },
      registrationOpen: activeEvent ? activeEvent.isRegistrationOpen : false,
      eventDate: activeEvent ? activeEvent.eventDate.toISOString() : null,
      recentRegistrations: recentRegistrations.map((r) => ({
        id: r.id,
        registrationId: r.registrationId,
        fullName: r.fullName,
        email: r.email,
        phone: r.phone,
        participationType: r.participationType,
        status: r.status,
        performanceType: r.poetryParticipant?.performanceType || null,
        poetryTitle: r.poetryParticipant?.poetryTitle || null,
        poetryTopic: r.poetryParticipant?.topic || FIXED_POETRY_TOPIC,
        createdAt: r.createdAt.toISOString(),
      })),
    };
  }

  async getRegistrationStats() {
    const activeEvent = await this.prisma.event.findFirst({
      where: { isActive: true },
    });

    const eventId = activeEvent?.id;
    const registrations = await this.prisma.registration.findMany({
      where: eventId ? { eventId } : {},
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const countsByDateMap = new Map<string, number>();
    for (const reg of registrations) {
      const dateStr = reg.createdAt.toISOString().split('T')[0];
      countsByDateMap.set(dateStr, (countsByDateMap.get(dateStr) || 0) + 1);
    }

    const daily = Array.from(countsByDateMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    return { daily };
  }

  async getAdminEventInfo() {
    const event = await this.prisma.event.findFirst({
      where: { isActive: true },
    });

    if (!event) {
      throw new NotFoundException('Active event not found');
    }

    return {
      id: event.id,
      title: event.title,
      slug: event.slug,
      eventDate: event.eventDate.toISOString(),
      timezone: event.timezone,
      location: event.location,
      registrationFee: Number(event.registrationFee),
      isRegistrationOpen: event.isRegistrationOpen,
      isActive: event.isActive,
    };
  }

  // -------------------------------------------------------------------
  // 4. Registration Management APIs (Listing, Details, Manual Creation, Updates)
  // -------------------------------------------------------------------

  async getRegistrations(query: AdminRegistrationQueryDto) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.RegistrationWhereInput = {};

    // Search filter across registrationId, fullName, email, phone
    if (query.search && query.search.trim()) {
      const search = query.search.trim();
      where.OR = [
        { registrationId: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const effectiveParticipation = query.participationType || query.participation;
    if (effectiveParticipation && (effectiveParticipation as string) !== 'ALL') {
      where.participationType = effectiveParticipation;
    }

    if (query.status && (query.status as string) !== 'ALL') {
      where.status = query.status;
    }

    let fromDate = query.fromDate || query.startDate;
    let toDate = query.toDate || query.endDate;

    if (query.dateRange && query.dateRange !== 'ALL' && !fromDate && !toDate) {
      const now = new Date();
      if (query.dateRange === 'TODAY') {
        fromDate = now.toISOString().split('T')[0];
        toDate = fromDate;
      } else if (query.dateRange === 'YESTERDAY') {
        const y = new Date();
        y.setDate(y.getDate() - 1);
        fromDate = y.toISOString().split('T')[0];
        toDate = fromDate;
      } else if (query.dateRange === 'LAST_7_DAYS') {
        const d7 = new Date();
        d7.setDate(d7.getDate() - 7);
        fromDate = d7.toISOString().split('T')[0];
      } else if (query.dateRange === 'LAST_30_DAYS') {
        const d30 = new Date();
        d30.setDate(d30.getDate() - 30);
        fromDate = d30.toISOString().split('T')[0];
      }
    }

    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) {
        where.createdAt.gte = new Date(fromDate);
      }
      if (toDate) {
        where.createdAt.lte = new Date(`${toDate}T23:59:59.999Z`);
      }
    }

    const orderByField = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const [items, total] = await Promise.all([
      this.prisma.registration.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderByField]: sortOrder },
        include: {
          poetryParticipant: true,
          event: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      }),
      this.prisma.registration.count({ where }),
    ]);

    const formattedItems = items.map((r) => ({
      id: r.id,
      registrationId: r.registrationId,
      fullName: r.fullName,
      email: r.email,
      phone: r.phone,
      age: r.age,
      city: r.city,
      gender: r.gender,
      participationType: r.participationType,
      stageName: r.stageIntroductionName,
      stageIntroductionName: r.stageIntroductionName,
      poetryTopic: FIXED_POETRY_TOPIC,
      performanceType: r.poetryParticipant?.performanceType || null,
      status: r.status,
      source: r.source || 'DIRECT',
      discoverySource: r.discoverySource,
      event: r.event,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      poetry: r.poetryParticipant
        ? {
            id: r.poetryParticipant.id,
            poetryTitle: r.poetryParticipant.poetryTitle,
            topic: FIXED_POETRY_TOPIC,
            language: r.poetryParticipant.language,
            performanceType: r.poetryParticipant.performanceType,
            description: r.poetryParticipant.description,
          }
        : null,
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      items: formattedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getRegistrationById(idOrRegId: string) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrRegId);
    const registration = await this.prisma.registration.findFirst({
      where: isObjectId
        ? { OR: [{ id: idOrRegId }, { registrationId: idOrRegId }] }
        : { registrationId: idOrRegId },
      include: {
        poetryParticipant: {
          include: {
            assignments: {
              include: {
                judge: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
            scores: {
              include: {
                criterion: true,
                judge: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            eventDate: true,
            location: true,
          },
        },
      },
    });

    if (!registration) {
      throw new NotFoundException(`Registration "${idOrRegId}" not found`);
    }

    return {
      id: registration.id,
      registrationId: registration.registrationId,
      fullName: registration.fullName,
      email: registration.email,
      phone: registration.phone,
      age: registration.age,
      city: registration.city,
      gender: registration.gender,
      participationType: registration.participationType,
      stageName: registration.stageIntroductionName,
      stageIntroductionName: registration.stageIntroductionName,
      poetryTopic: FIXED_POETRY_TOPIC,
      performanceType: registration.poetryParticipant?.performanceType || null,
      source: registration.source || 'DIRECT',
      discoverySource: registration.discoverySource,
      status: registration.status,
      event: registration.event,
      createdAt: registration.createdAt.toISOString(),
      updatedAt: registration.updatedAt.toISOString(),
      poetry: registration.poetryParticipant
        ? {
            id: registration.poetryParticipant.id,
            poetryTitle: registration.poetryParticipant.poetryTitle,
            topic: FIXED_POETRY_TOPIC,
            language: registration.poetryParticipant.language,
            performanceType: registration.poetryParticipant.performanceType,
            description: registration.poetryParticipant.description,
            reviewStatus: registration.poetryParticipant.reviewStatus,
            reviewNote: registration.poetryParticipant.reviewNote,
            createdAt: registration.poetryParticipant.createdAt.toISOString(),
            judges: registration.poetryParticipant.assignments.map((a) => a.judge),
            scores: registration.poetryParticipant.scores.map((s) => ({
              id: s.id,
              criterionName: s.criterion.name,
              score: s.score,
              comment: s.comment,
              judgeName: s.judge.name,
            })),
          }
        : null,
    };
  }

  async createRegistrationByAdmin(dto: AdminCreateRegistrationDto, adminId: string) {
    const activeEvent = await this.prisma.event.findFirst({
      where: { isActive: true },
      include: {
        poetryCompetitions: {
          where: { isOpen: true },
        },
      },
    });

    if (!activeEvent) {
      throw new NotFoundException('Active event not found');
    }

    // Fixed poetry topic validation
    if (dto.topic && dto.topic.trim().toUpperCase() !== FIXED_POETRY_TOPIC) {
      throw new BadRequestException(
        `Invalid poetry topic "${dto.topic}". The only accepted topic is "${FIXED_POETRY_TOPIC}".`,
      );
    }

    const normalizedEmail = dto.email.toLowerCase().trim();
    const normalizedPhone = dto.phone.trim();

    // Check duplicate email or phone for active event
    const existing = await this.prisma.registration.findFirst({
      where: {
        eventId: activeEvent.id,
        OR: [{ email: normalizedEmail }, { phone: normalizedPhone }],
      },
    });

    if (existing) {
      throw new ConflictException('A participant with this email or phone is already registered.');
    }

    const stageIntroName =
      dto.stageIntroductionName?.trim() ||
      dto.stageName?.trim() ||
      dto.poetryTitle?.trim() ||
      null;

    const isPerformer = dto.participationType === ParticipationType.ATTEND_AND_POETRY;

    const rawToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const created = await this.prisma.$transaction(async (tx) => {
      // Generate collision-safe registrationId DBT-2026-XXXXXX
      let registrationId = '';
      let isUnique = false;
      let attempts = 0;
      const count = await tx.registration.count({ where: { eventId: activeEvent.id } });
      let nextSeq = count + 1;

      while (!isUnique && attempts < 10) {
        registrationId = `DBT-2026-${String(nextSeq).padStart(6, '0')}`;
        const match = await tx.registration.findUnique({ where: { registrationId } });
        if (!match) {
          isUnique = true;
        } else {
          nextSeq += Math.floor(Math.random() * 10) + 1;
          attempts++;
        }
      }

      const reg = await tx.registration.create({
        data: {
          registrationId,
          eventId: activeEvent.id,
          fullName: dto.fullName.trim(),
          email: normalizedEmail,
          phone: normalizedPhone,
          age: dto.age ?? null,
          city: dto.city ? dto.city.trim() : null,
          gender: dto.gender ? dto.gender.trim() : null,
          participationType: dto.participationType || ParticipationType.ATTEND_ONLY,
          discoverySource: dto.discoverySource,
          stageIntroductionName: stageIntroName,
          mediaAgreement: true,
          status: 'REGISTERED',
          verificationTokenHash,
          source: dto.source || 'ADMIN_MANUAL',
        },
      });

      if (isPerformer && stageIntroName) {
        const competitionId =
          activeEvent.poetryCompetitions && activeEvent.poetryCompetitions.length > 0
            ? activeEvent.poetryCompetitions[0].id
            : null;

        await tx.poetryParticipant.create({
          data: {
            registrationId: reg.id,
            competitionId,
            poetryTitle: dto.poetryTitle?.trim() || stageIntroName,
            topic: FIXED_POETRY_TOPIC,
            language: dto.poetryLanguage || 'NEPALI',
            performanceType: dto.performanceType || PerformanceType.POETRY,
            description: dto.description?.trim() || null,
          },
        });
      }

      return reg;
    });

    await this.auditService.logAction({
      adminId,
      action: AuditAction.LOGIN, // or general action
      entityType: 'Registration',
      entityId: created.id,
      metadata: { registrationId: created.registrationId, createdBy: adminId },
    });

    return this.getRegistrationById(created.id);
  }

  async updateRegistrationByAdmin(id: string, dto: AdminUpdateRegistrationDto, adminId: string) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const registration = await this.prisma.registration.findFirst({
      where: isObjectId
        ? { OR: [{ id }, { registrationId: id }] }
        : { registrationId: id },
      include: { poetryParticipant: true },
    });

    if (!registration) {
      throw new NotFoundException(`Registration "${id}" not found`);
    }

    const regData: Prisma.RegistrationUpdateInput = {};

    if (dto.fullName) regData.fullName = dto.fullName.trim();
    if (dto.email && dto.email.toLowerCase().trim() !== registration.email) {
      const email = dto.email.toLowerCase().trim();
      const conflict = await this.prisma.registration.findFirst({
        where: { eventId: registration.eventId, email, NOT: { id: registration.id } },
      });
      if (conflict) throw new ConflictException('Email already registered for another participant.');
      regData.email = email;
    }
    if (dto.phone && dto.phone.trim() !== registration.phone) {
      const phone = dto.phone.trim();
      const conflict = await this.prisma.registration.findFirst({
        where: { eventId: registration.eventId, phone, NOT: { id: registration.id } },
      });
      if (conflict) throw new ConflictException('Phone already registered for another participant.');
      regData.phone = phone;
    }
    if (dto.age !== undefined) regData.age = dto.age;
    if (dto.city !== undefined) regData.city = dto.city ? dto.city.trim() : null;
    if (dto.gender !== undefined) regData.gender = dto.gender ? dto.gender.trim() : null;
    if (dto.participationType) regData.participationType = dto.participationType;
    if (dto.status) regData.status = dto.status;

    const stageIntro = dto.stageIntroductionName?.trim() || dto.stageName?.trim();
    if (stageIntro !== undefined) {
      regData.stageIntroductionName = stageIntro;
    }

    await this.prisma.registration.update({
      where: { id: registration.id },
      data: regData,
    });

    // Update or create poetry participant if performance details provided
    if (
      dto.poetryTitle ||
      dto.performanceType ||
      dto.poetryLanguage ||
      dto.description !== undefined
    ) {
      if (registration.poetryParticipant) {
        await this.prisma.poetryParticipant.update({
          where: { id: registration.poetryParticipant.id },
          data: {
            poetryTitle: dto.poetryTitle ? dto.poetryTitle.trim() : undefined,
            performanceType: dto.performanceType,
            language: dto.poetryLanguage,
            description: dto.description !== undefined ? dto.description : undefined,
            topic: FIXED_POETRY_TOPIC,
          },
        });
      } else if (dto.poetryTitle || stageIntro) {
        const activeComp = await this.prisma.poetryCompetition.findFirst();
        await this.prisma.poetryParticipant.create({
          data: {
            registrationId: registration.id,
            competitionId: activeComp?.id,
            poetryTitle: dto.poetryTitle?.trim() || stageIntro || 'Performance',
            topic: FIXED_POETRY_TOPIC,
            language: dto.poetryLanguage || 'NEPALI',
            performanceType: dto.performanceType || PerformanceType.POETRY,
            description: dto.description?.trim() || null,
          },
        });
      }
    }

    return this.getRegistrationById(registration.id);
  }

  // -------------------------------------------------------------------
  // 5. Poetry Participant Management APIs
  // -------------------------------------------------------------------

  async getPoetryParticipants(query: AdminPoetryQueryDto) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.PoetryParticipantWhereInput = {};

    if (query.search && query.search.trim()) {
      const search = query.search.trim();
      where.OR = [
        { poetryTitle: { contains: search, mode: 'insensitive' } },
        { registration: { fullName: { contains: search, mode: 'insensitive' } } },
        { registration: { registrationId: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (query.language && (query.language as string) !== 'ALL') {
      where.language = query.language;
    }

    if (query.performanceType && (query.performanceType as string) !== 'ALL') {
      where.performanceType = query.performanceType;
    }

    if (query.reviewStatus && query.reviewStatus !== 'ALL') {
      where.reviewStatus = query.reviewStatus as any;
    }

    const [items, total] = await Promise.all([
      this.prisma.poetryParticipant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          registration: {
            select: {
              id: true,
              registrationId: true,
              fullName: true,
              email: true,
              phone: true,
              city: true,
              status: true,
            },
          },
          assignments: {
            include: {
              judge: {
                select: { id: true, name: true, email: true },
              },
            },
          },
        },
      }),
      this.prisma.poetryParticipant.count({ where }),
    ]);

    const formattedItems = items.map((p) => ({
      id: p.id,
      registrationId: p.registration.registrationId,
      participantName: p.registration.fullName,
      email: p.registration.email,
      phone: p.registration.phone,
      poetryTitle: p.poetryTitle,
      poetryTopic: FIXED_POETRY_TOPIC,
      language: p.language,
      performanceType: p.performanceType,
      description: p.description,
      reviewStatus: p.reviewStatus,
      assignedJudges: p.assignments.map((a) => a.judge),
      registrationDate: p.createdAt.toISOString(),
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      items: formattedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getPoetryParticipantById(id: string) {
    const participant = await this.prisma.poetryParticipant.findUnique({
      where: { id },
      include: {
        registration: {
          select: {
            id: true,
            registrationId: true,
            fullName: true,
            email: true,
            phone: true,
            city: true,
            status: true,
          },
        },
        assignments: {
          include: {
            judge: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        scores: {
          include: {
            criterion: true,
            judge: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!participant) {
      throw new NotFoundException(`Poetry participant "${id}" not found`);
    }

    return {
      id: participant.id,
      registrationId: participant.registration.registrationId,
      participantName: participant.registration.fullName,
      email: participant.registration.email,
      phone: participant.registration.phone,
      poetryTitle: participant.poetryTitle,
      poetryTopic: FIXED_POETRY_TOPIC,
      language: participant.language,
      performanceType: participant.performanceType,
      description: participant.description,
      submittedAt: participant.createdAt.toISOString(),
      reviewStatus: participant.reviewStatus,
      reviewNote: participant.reviewNote,
      assignedJudges: participant.assignments.map((a) => a.judge),
      scores: participant.scores.map((s) => ({
        id: s.id,
        criterion: s.criterion.name,
        score: s.score,
        comment: s.comment,
        judgeName: s.judge.name,
      })),
    };
  }
}
