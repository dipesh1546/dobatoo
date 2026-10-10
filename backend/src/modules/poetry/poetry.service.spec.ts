import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PoetryService } from './poetry.service';
import { PrismaService } from '../../database/prisma.service';

describe('PoetryService', () => {
  let service: PoetryService;

  const mockEventData = {
    id: 'evt-123',
    slug: 'dobato-grand-launch',
    isActive: true,
    poetryCompetitions: [
      {
        id: 'comp-1',
        title: 'DOBATO Poetry Competition',
        theme: 'DOBATO — जहाँ दुई बाटो भेटिन्छन्',
        description: 'Competition description',
        isOpen: true,
        guidelines: [
          { id: 'g1', title: 'Original Work', description: 'Original work description', displayOrder: 1 },
        ],
      },
    ],
    prizes: [
      {
        id: 'p1',
        position: 1,
        title: 'First Prize',
        cashAmount: 2500,
        currency: 'NPR',
        benefits: ['Lifetime Free DOBATO Access', '1 T-shirt', '1 Award'],
        displayOrder: 1,
      },
      {
        id: 'p2',
        position: 2,
        title: 'Second Prize',
        cashAmount: 1000,
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
        PoetryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PoetryService>(PoetryService);
    jest.clearAllMocks();
  });

  describe('getActivePoetryCompetition', () => {
    it('should return active poetry competition with guidelines and un-finalized judging status', async () => {
      mockPrismaService.event.findFirst.mockResolvedValue(mockEventData);

      const result = await service.getActivePoetryCompetition();

      expect(result.title).toBe('DOBATO Poetry Competition');
      expect(result.theme).toBe('DOBATO — जहाँ दुई बाटो भेटिन्छन्');
      expect(result.isOpen).toBe(true);
      expect(result.judging.isFinalized).toBe(false);
      expect(result.guidelines).toHaveLength(1);
      expect(result.prizes[0].cashAmount).toBe(2500);
    });

    it('should throw NotFoundException when no active competition exists', async () => {
      mockPrismaService.event.findFirst.mockResolvedValue(null);

      await expect(service.getActivePoetryCompetition()).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPoetryCompetitionByEventSlug', () => {
    it('should return poetry competition for given event slug', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(mockEventData);

      const result = await service.getPoetryCompetitionByEventSlug('dobato-grand-launch');

      expect(result.title).toBe('DOBATO Poetry Competition');
      expect(result.judging.isFinalized).toBe(false);
    });

    it('should throw NotFoundException if event or poetry competition is not found', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(null);

      await expect(service.getPoetryCompetitionByEventSlug('invalid-slug')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
