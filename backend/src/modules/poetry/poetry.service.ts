import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PublicPoetryCompetitionResponseDto } from './dto/poetry-response.dto';

@Injectable()
export class PoetryService {
  private readonly logger = new Logger(PoetryService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get the active poetry competition details for the active event.
   */
  async getActivePoetryCompetition(): Promise<PublicPoetryCompetitionResponseDto> {
    const event = await this.prisma.event.findFirst({
      where: { isActive: true },
      include: {
        poetryCompetitions: {
          include: {
            guidelines: {
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
        prizes: {
          orderBy: [{ position: 'asc' }, { displayOrder: 'asc' }],
        },
      },
    });

    if (!event || !event.poetryCompetitions || event.poetryCompetitions.length === 0) {
      this.logger.warn('Active poetry competition requested but none found');
      throw new NotFoundException('No active poetry competition currently available');
    }

    const competition = event.poetryCompetitions[0];
    return this.mapToPoetryDto(competition, event.prizes);
  }

  /**
   * Get poetry competition associated with a specific event slug.
   */
  async getPoetryCompetitionByEventSlug(slug: string): Promise<PublicPoetryCompetitionResponseDto> {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        poetryCompetitions: {
          include: {
            guidelines: {
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
        prizes: {
          orderBy: [{ position: 'asc' }, { displayOrder: 'asc' }],
        },
      },
    });

    if (!event || !event.isActive || !event.poetryCompetitions || event.poetryCompetitions.length === 0) {
      this.logger.warn(`Poetry competition for event slug "${slug}" not found`);
      throw new NotFoundException(`Poetry competition for event "${slug}" not found`);
    }

    const competition = event.poetryCompetitions[0];
    return this.mapToPoetryDto(competition, event.prizes);
  }

  /**
   * Helper mapping Prisma entity to PublicPoetryCompetitionResponseDto.
   */
  private mapToPoetryDto(competition: any, prizes: any[]): PublicPoetryCompetitionResponseDto {
    return {
      id: competition.id,
      title: competition.title,
      theme: competition.theme,
      description: competition.description,
      isOpen: Boolean(competition.isOpen),
      guidelines: (competition.guidelines || []).map((g: any) => ({
        id: g.id,
        title: g.title,
        description: g.description,
        displayOrder: g.displayOrder,
      })),
      judging: {
        isFinalized: false,
      },
      prizes: (prizes || []).map((p: any) => {
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
    };
  }
}
