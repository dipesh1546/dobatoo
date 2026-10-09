import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HighlightResponseDto {
  @ApiProperty({ example: 'h1-uuid' })
  id: string;

  @ApiProperty({ example: 'POETRY' })
  title: string;

  @ApiProperty({ example: "Express your emotions through words on the theme 'DOBATO — जहाँ दुई बाटो भेटिन्छन्'" })
  description: string;

  @ApiProperty({ example: 'poetry' })
  iconKey: string;

  @ApiProperty({ example: 1 })
  displayOrder: number;
}

export class PrizeResponseDto {
  @ApiProperty({ example: 'p1-uuid' })
  id: string;

  @ApiProperty({ example: 1 })
  position: number;

  @ApiProperty({ example: 'First Prize' })
  title: string;

  @ApiProperty({ example: 3000, nullable: true })
  cashAmount: number | null;

  @ApiPropertyOptional({ example: 3000, nullable: true })
  cashPrize?: number | null;

  @ApiProperty({ example: 'NPR' })
  currency: string;

  @ApiProperty({
    type: [String],
    example: ['Lifetime Free DOBATO Access', '1 T-shirt', '1 Award'],
  })
  benefits: string[];

  @ApiProperty({ example: 1 })
  displayOrder: number;
}

export class FAQResponseDto {
  @ApiProperty({ example: 'faq-uuid' })
  id: string;

  @ApiProperty({ example: 'Is registration free?' })
  question: string;

  @ApiProperty({ example: 'Yes. Registration for the DOBATO launch event is free.' })
  answer: string;

  @ApiProperty({ example: 1 })
  displayOrder: number;
}

export class PerformanceResponseDto {
  @ApiProperty({ example: 'perf-uuid' })
  id: string;

  @ApiProperty({ example: 'Live Music' })
  title: string;

  @ApiProperty({ example: 'Experience music and live performances during the DOBATO launch.', nullable: true })
  description: string | null;

  @ApiProperty({ example: null, nullable: true })
  performerName: string | null;

  @ApiProperty({ example: 'music' })
  performanceType: string;

  @ApiProperty({ example: 1 })
  displayOrder: number;
}

export class PoetryGuidelineResponseDto {
  @ApiProperty({ example: 'g-uuid' })
  id: string;

  @ApiProperty({ example: 'Original Work' })
  title: string;

  @ApiProperty({ example: 'Poetry must be original work by the participant.' })
  description: string;

  @ApiProperty({ example: 1 })
  displayOrder: number;
}

export class PoetryCompetitionResponseDto {
  @ApiProperty({ example: 'comp-uuid' })
  id: string;

  @ApiProperty({ example: 'DOBATO Poetry Competition' })
  title: string;

  @ApiProperty({ example: 'DOBATO — जहाँ दुई बाटो भेटिन्छन्' })
  theme: string;

  @ApiProperty({ example: 'The DOBATO Poetry Competition invites participants to interpret the idea of two paths meeting...' })
  description: string;

  @ApiProperty({ example: true })
  isOpen: boolean;
}

export class EventDetailDto {
  @ApiProperty({ example: 'event-uuid' })
  id: string;

  @ApiProperty({ example: 'DOBATO GRAND LAUNCH' })
  title: string;

  @ApiProperty({ example: 'dobato-grand-launch' })
  slug: string;

  @ApiProperty({ example: 'An evening of poetry, music, creativity and meaningful connections.' })
  description: string;

  @ApiProperty({ example: 'Two Paths. One Connection.' })
  slogan: string;

  @ApiProperty({ example: 'Where Paths Cross, Stories Begin.' })
  secondarySlogan: string;

  @ApiProperty({ example: 'DOBATO — जहाँ दुई बाटो भेटिन्छन्' })
  poetryTheme: string;

  @ApiProperty({ example: '2026-10-16T00:00:00+05:45' })
  eventDate: string;

  @ApiProperty({ example: 'Asia/Kathmandu' })
  timezone: string;

  @ApiProperty({ example: 'Kathmandu, Nepal' })
  location: string;

  @ApiProperty({ example: 0 })
  registrationFee: number;

  @ApiProperty({ example: true })
  isRegistrationOpen: boolean;
}

export class ExtendedPublicEventResponseDto {
  @ApiProperty({ type: EventDetailDto })
  event: EventDetailDto;

  @ApiProperty({ type: [HighlightResponseDto] })
  highlights: HighlightResponseDto[];

  @ApiProperty({ type: [PrizeResponseDto] })
  prizes: PrizeResponseDto[];

  @ApiProperty({ type: PoetryCompetitionResponseDto, nullable: true })
  poetryCompetition: PoetryCompetitionResponseDto | null;

  @ApiProperty({ type: [PoetryGuidelineResponseDto] })
  guidelines: PoetryGuidelineResponseDto[];

  @ApiProperty({ type: [FAQResponseDto] })
  faqs: FAQResponseDto[];

  @ApiProperty({ type: [PerformanceResponseDto] })
  performances: PerformanceResponseDto[];
}
