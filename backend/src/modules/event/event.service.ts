import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ExtendedPublicEventResponseDto } from './dto/event-response.dto';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetch the primary active public event for DOBATO platform.
   * Includes highlights, prizes, poetry competition, guidelines, FAQs, and performances.
   */
  async getActiveEvent(): Promise<ExtendedPublicEventResponseDto> {
    const event = await this.prisma.event.findFirst({
      where: { isActive: true },
      include: {
        highlights: {
          orderBy: { displayOrder: 'asc' },
        },
        prizes: {
          orderBy: [{ position: 'asc' }, { displayOrder: 'asc' }],
        },
        poetryCompetitions: {
          include: {
            guidelines: {
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
        faqs: {
          where: { isPublished: true },
          orderBy: { displayOrder: 'asc' },
        },
        performances: {
          where: { isPublished: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { eventDate: 'asc' },
    });

    if (!event) {
      this.logger.warn('Active public event requested but none found in database');
      throw new NotFoundException('No active event currently available');
    }

    return this.mapToExtendedPublicDto(event);
  }

  /**
   * Fetch a public event by its unique URL slug.
   * Throws 404 NotFoundException if event does not exist or is inactive.
   */
  async getEventBySlug(slug: string): Promise<ExtendedPublicEventResponseDto> {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        highlights: {
          orderBy: { displayOrder: 'asc' },
        },
        prizes: {
          orderBy: [{ position: 'asc' }, { displayOrder: 'asc' }],
        },
        poetryCompetitions: {
          include: {
            guidelines: {
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
        faqs: {
          where: { isPublished: true },
          orderBy: { displayOrder: 'asc' },
        },
        performances: {
          where: { isPublished: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!event || !event.isActive) {
      this.logger.warn(`Public event with slug "${slug}" not found or inactive`);
      throw new NotFoundException(`Event with slug "${slug}" not found`);
    }

    return this.mapToExtendedPublicDto(event);
  }

  /**
   * Maps Prisma Event entity to clean ExtendedPublicEventResponseDto.
   * Strips administrative database metadata and formats values cleanly.
   */
  private mapToExtendedPublicDto(event: any): ExtendedPublicEventResponseDto {
    const competition = event.poetryCompetitions && event.poetryCompetitions.length > 0
      ? event.poetryCompetitions[0]
      : null;

    const poetryCompetitionDto = competition
      ? {
          id: competition.id,
          title: competition.title,
          theme: competition.theme,
          description: competition.description,
          isOpen: Boolean(competition.isOpen),
        }
      : null;

    const guidelinesDto = competition && competition.guidelines
      ? competition.guidelines.map((g: any) => ({
          id: g.id,
          title: g.title,
          description: g.description,
          displayOrder: g.displayOrder,
        }))
      : [];

    return {
      event: {
        id: event.id,
        title: event.title,
        slug: event.slug,
        description: event.description || '',
        slogan: event.slogan || 'Two Paths. One Connection.',
        secondarySlogan: event.secondarySlogan || 'Where Paths Cross, Stories Begin.',
        poetryTheme: event.poetryTheme || '',
        eventDate: event.eventDate ? event.eventDate.toISOString() : '',
        timezone: event.timezone || 'Asia/Kathmandu',
        location: event.location || '',
        registrationFee: Number(event.registrationFee || 0),
        isRegistrationOpen: Boolean(event.isRegistrationOpen),
      },
      highlights: (event.highlights || []).map((h: any) => ({
        id: h.id,
        title: h.title,
        description: h.description,
        iconKey: h.iconKey,
        displayOrder: h.displayOrder,
      })),
      prizes: (event.prizes || []).map((p: any) => {
        const cashValue = p.cashAmount !== null && p.cashAmount !== undefined ? Number(p.cashAmount) : null;
        return {
          id: p.id,
          position: p.position,
          title: p.title,
          cashAmount: cashValue,
          cashPrize: cashValue,
          currency: p.currency || 'NPR',
          benefits: p.benefits || [],
          displayOrder: p.displayOrder,
        };
      }),
      poetryCompetition: poetryCompetitionDto,
      guidelines: guidelinesDto,
      faqs: (event.faqs || []).map((f: any) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        displayOrder: f.displayOrder,
      })),
      performances: (event.performances || []).map((perf: any) => ({
        id: perf.id,
        title: perf.title,
        description: perf.description || null,
        performerName: perf.performerName || null,
        performanceType: perf.performanceType || 'music',
        displayOrder: perf.displayOrder,
      })),
    };
  }
}
