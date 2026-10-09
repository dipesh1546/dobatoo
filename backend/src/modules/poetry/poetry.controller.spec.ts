import { Test, TestingModule } from '@nestjs/testing';
import { PoetryController } from './poetry.controller';
import { PoetryService } from './poetry.service';
import { PublicPoetryCompetitionResponseDto } from './dto/poetry-response.dto';

describe('PoetryController', () => {
  let controller: PoetryController;

  const mockPoetryDto: PublicPoetryCompetitionResponseDto = {
    id: 'comp-1',
    title: 'DOBATO Poetry Competition',
    theme: 'DOBATO — जहाँ दुई बाटो भेटिन्छन्',
    description: 'Competition description',
    isOpen: true,
    guidelines: [
      { id: 'g1', title: 'Original Work', description: 'Original work', displayOrder: 1 },
    ],
    judging: { isFinalized: false },
    prizes: [
      { id: 'p1', position: 1, title: 'First Prize', cashAmount: 3000, cashPrize: 3000, currency: 'NPR', benefits: ['Lifetime Free DOBATO Access', '1 T-shirt', '1 Award'], displayOrder: 1 },
      { id: 'p2', position: 2, title: 'Second Prize', cashAmount: 2000, cashPrize: 2000, currency: 'NPR', benefits: ['6 Months Free DOBATO Access', '1 T-shirt', '1 Award'], displayOrder: 2 },
      { id: 'p3', position: 3, title: 'Third Prize', cashAmount: null, cashPrize: null, currency: 'NPR', benefits: ['3 Months Free DOBATO Access', '1 T-shirt', '1 Award'], displayOrder: 3 },
    ],
  };

  const mockPoetryService = {
    getActivePoetryCompetition: jest.fn(),
    getPoetryCompetitionByEventSlug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoetryController],
      providers: [{ provide: PoetryService, useValue: mockPoetryService }],
    }).compile();

    controller = module.get<PoetryController>(PoetryController);
    jest.clearAllMocks();
  });

  describe('getActivePoetryCompetition', () => {
    it('should return wrapped response for active poetry competition', async () => {
      mockPoetryService.getActivePoetryCompetition.mockResolvedValue(mockPoetryDto);

      const result = await controller.getActivePoetryCompetition();

      expect(result.message).toBe('Poetry competition fetched successfully');
      expect(result.data.title).toBe('DOBATO Poetry Competition');
      expect(result.data.judging.isFinalized).toBe(false);
    });
  });

  describe('getPoetryCompetitionByEventSlug', () => {
    it('should return poetry competition for given event slug', async () => {
      mockPoetryService.getPoetryCompetitionByEventSlug.mockResolvedValue(mockPoetryDto);

      const result = await controller.getPoetryCompetitionByEventSlug({ slug: 'dobato-grand-launch' });

      expect(result.message).toBe('Poetry competition fetched successfully');
      expect(result.data.theme).toBe('DOBATO — जहाँ दुई बाटो भेटिन्छन्');
    });
  });
});
