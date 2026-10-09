import { ApiProperty } from '@nestjs/swagger';
import { PoetryGuidelineResponseDto, PrizeResponseDto } from '../../event/dto/event-response.dto';

export class JudgingStatusDto {
  @ApiProperty({ example: false })
  isFinalized: boolean;
}

export class PublicPoetryCompetitionResponseDto {
  @ApiProperty({ example: 'comp-uuid' })
  id: string;

  @ApiProperty({ example: 'DOBATO Poetry Competition' })
  title: string;

  @ApiProperty({ example: 'DOBATO — जहाँ दुई बाटो भेटिन्छन्' })
  theme: string;

  @ApiProperty({
    example:
      'The DOBATO Poetry Competition invites participants to interpret the idea of two paths meeting through their own words, emotions and imagination.',
  })
  description: string;

  @ApiProperty({ example: true })
  isOpen: boolean;

  @ApiProperty({ type: [PoetryGuidelineResponseDto] })
  guidelines: PoetryGuidelineResponseDto[];

  @ApiProperty({ type: JudgingStatusDto })
  judging: JudgingStatusDto;

  @ApiProperty({ type: [PrizeResponseDto] })
  prizes: PrizeResponseDto[];
}
