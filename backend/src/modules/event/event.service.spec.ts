import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EventService } from './event.service';
import { PrismaService } from '../../database/prisma.service';

describe('EventService (Phase 3)', () => {
  let service: EventService;

  const mockEventData = {
    id: 'evt-123',
    title: 'DOBATO GRAND LAUNCH',
    slug: 'dobato-grand-launch',
    description: 'An evening of poetry, music, creativity and meaningful connections.',
    slogan: 'Two Paths. One Connection.',
    secondarySlogan: 'Where Paths Cross, Stories Begin.',
    poetryTheme: 'DOBATO — जहाँ दुई बाटो भेटिन्छन्',
    eventDate: new Date('2026-10-16T00:00:00+05:45'),
    timezone: 'Asia/Kathmandu',
    location: 'Kathmandu, Nepal',
    registrationFee: 0,
    isRegistrationOpen: true,
    isActive: true,
    highlights: [
      { id: 'h1', title: 'POETRY', description: 'Poetry contest', iconKey: 'poetry', displayOrder: 1 },
    ],
    prizes: [
      {
        id: 'p1',
        position: 1,
        title: 'First Prize',
        cashAmount: 3000,
        currency: 'NPR',
        benefits: ['Lifetime Free DOBATO Access', '1 T-shirt', '1 Award'],
        displayOrder: 1,
      },
      {
        id: 'p2',
        position: 2,
        title: 'Second Prize',
        cashAmount: 2000,
        currency: 'NPR',
        benefits: ['6 Months Free DOBATO Access', '1 T-shirt', '1 Award'],
        displayOrder: 2,
      },
      {
        id: 'p3',
        position: 3,
        title: 'Third Prize',
        cashAmount: null,
        currency: 'NPR',
        benefits: ['3 Months Free DOBATO Access', '1 T-shirt', '1 Award'],
        displayOrder: 3,
      },
    ],
    poetryCompetitions: [
      {
        id: 'comp-1',
        title: 'DOBATO Poetry Competition',
        theme: 'DOBATO — जहाँ दुई बाटो भेटिन्छन्',
        description: 'Competition description',
        isOpen: true,
        guidelines: [
          { id: 'g1', title: 'Original Work', description: 'Original work', displayOrder: 1 },
        ],
      },
    ],
    faqs: [
      { id: 'faq1', question: 'Is registration free?', answer: 'Yes.', displayOrder: 1, isPublished: true },
    ],
    performances: [
      { id: 'perf1', title: 'Live Music', description: 'Music concert', performerName: null, performanceType: 'music', displayOrder: 1, isPublished: true },
    ],
  };

  const mockPrismaService = {
    event: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    jest.clearAllMocks();
  });

  describe('getActiveEvent', () => {
    it('should return complete event structure with poetry, FAQs, guidelines, and performances', async () => {
      mockPrismaService.event.findFirst.mockResolvedValue(mockEventData);

      const result = await service.getActiveEvent();

      expect(result.event.slug).toBe('dobato-grand-launch');
      expect(result.event.timezone).toBe('Asia/Kathmandu');
      expect(result.poetryCompetition?.title).toBe('DOBATO Poetry Competition');
      expect(result.guidelines).toHaveLength(1);
      expect(result.faqs).toHaveLength(1);
      expect(result.performances).toHaveLength(1);

      expect(result.prizes).toHaveLength(3);
      expect(result.prizes[0].cashAmount).toBe(3000);
      expect(result.prizes[0].cashPrize).toBe(3000);
      expect(result.prizes[1].cashAmount).toBe(2000);
      expect(result.prizes[1].cashPrize).toBe(2000);
      expect(result.prizes[2].cashAmount).toBeNull();
      expect(result.prizes[2].cashPrize).toBeNull();
      expect(result.prizes[2].benefits).toEqual([
        '3 Months Free DOBATO Access',
        '1 T-shirt',
        '1 Award',
      ]);
    });

    it('should throw NotFoundException when no active event exists', async () => {
      mockPrismaService.event.findFirst.mockResolvedValue(null);

      await expect(service.getActiveEvent()).rejects.toThrow(NotFoundException);
    });
  });

  describe('getEventBySlug', () => {
    it('should return extended event details for valid slug', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(mockEventData);

      const result = await service.getEventBySlug('dobato-grand-launch');

      expect(result.event.title).toBe('DOBATO GRAND LAUNCH');
      expect(result.faqs[0].question).toBe('Is registration free?');
    });

    it('should throw NotFoundException for non-existent slug', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(null);

      await expect(service.getEventBySlug('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
