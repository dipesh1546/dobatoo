import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { ExtendedPublicEventResponseDto } from './dto/event-response.dto';

describe('EventController (Phase 3)', () => {
  let controller: EventController;

  const mockExtendedPublicEventDto: ExtendedPublicEventResponseDto = {
    event: {
      id: 'evt-123',
      title: 'DOBATO GRAND LAUNCH',
      slug: 'dobato-grand-launch',
      description: 'An evening of poetry, music, creativity and meaningful connections.',
      slogan: 'Two Paths. One Connection.',
      secondarySlogan: 'Where Paths Cross, Stories Begin.',
      poetryTheme: 'DOBATO — जहाँ दुई बाटो भेटिन्छन्',
      eventDate: '2026-10-16T00:00:00+05:45',
      timezone: 'Asia/Kathmandu',
      location: 'Kathmandu, Nepal',
      registrationFee: 0,
      isRegistrationOpen: true,
    },
    highlights: [],
    prizes: [
      { id: 'p1', position: 1, title: 'First Prize', cashAmount: 3000, cashPrize: 3000, currency: 'NPR', benefits: ['Lifetime Free DOBATO Access', '1 T-shirt', '1 Award'], displayOrder: 1 },
      { id: 'p2', position: 2, title: 'Second Prize', cashAmount: 2000, cashPrize: 2000, currency: 'NPR', benefits: ['6 Months Free DOBATO Access', '1 T-shirt', '1 Award'], displayOrder: 2 },
      { id: 'p3', position: 3, title: 'Third Prize', cashAmount: null, cashPrize: null, currency: 'NPR', benefits: ['3 Months Free DOBATO Access', '1 T-shirt', '1 Award'], displayOrder: 3 },
    ],
    poetryCompetition: {
      id: 'comp-1',
      title: 'DOBATO Poetry Competition',
      theme: 'DOBATO — जहाँ दुई बाटो भेटिन्छन्',
      description: 'Description',
      isOpen: true,
    },
    guidelines: [],
    faqs: [],
    performances: [],
  };

  const mockEventService = {
    getActiveEvent: jest.fn(),
    getEventBySlug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [{ provide: EventService, useValue: mockEventService }],
    }).compile();

    controller = module.get<EventController>(EventController);
    jest.clearAllMocks();
  });

  describe('getActiveEvent', () => {
    it('should return active event wrapped in message structure', async () => {
      mockEventService.getActiveEvent.mockResolvedValue(mockExtendedPublicEventDto);

      const result = await controller.getActiveEvent();

      expect(result.message).toBe('Event fetched successfully');
      expect(result.data.event.slug).toBe('dobato-grand-launch');
      expect(result.data.event.registrationFee).toBe(0);
      expect(result.data.poetryCompetition?.title).toBe('DOBATO Poetry Competition');
    });
  });

  describe('getEventBySlug', () => {
    it('should return event details when slug exists', async () => {
      mockEventService.getEventBySlug.mockResolvedValue(mockExtendedPublicEventDto);

      const result = await controller.getEventBySlug({ slug: 'dobato-grand-launch' });

      expect(result.message).toBe('Event fetched successfully');
      expect(result.data.event.title).toBe('DOBATO GRAND LAUNCH');
    });
  });
});
