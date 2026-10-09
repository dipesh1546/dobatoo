import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PoetryService } from './poetry.service';
import { EventSlugParamDto } from '../event/dto/event-param.dto';
import { PublicPoetryCompetitionResponseDto } from './dto/poetry-response.dto';

@ApiTags('Poetry')
@Controller()
export class PoetryController {
  constructor(private readonly poetryService: PoetryService) {}

  @Get('poetry')
  @ApiOperation({
    summary: 'Get Active Poetry Competition Details',
    description: 'Retrieves the official DOBATO poetry competition details, guidelines, theme, and prize information.',
  })
  @ApiResponse({
    status: 200,
    description: 'Poetry competition fetched successfully',
    type: PublicPoetryCompetitionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No active poetry competition found',
  })
  async getActivePoetryCompetition(): Promise<{ message: string; data: PublicPoetryCompetitionResponseDto }> {
    const competition = await this.poetryService.getActivePoetryCompetition();
    return {
      message: 'Poetry competition fetched successfully',
      data: competition,
    };
  }

  @Get('event/:slug/poetry')
  @ApiOperation({
    summary: 'Get Poetry Competition Details by Event Slug',
    description: 'Retrieves the poetry competition details associated with a specific event slug.',
  })
  @ApiParam({
    name: 'slug',
    description: 'Unique URL slug of the event',
    example: 'dobato-grand-launch',
  })
  @ApiResponse({
    status: 200,
    description: 'Poetry competition fetched successfully',
    type: PublicPoetryCompetitionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Poetry competition or event not found',
  })
  async getPoetryCompetitionByEventSlug(
    @Param() params: EventSlugParamDto,
  ): Promise<{ message: string; data: PublicPoetryCompetitionResponseDto }> {
    const competition = await this.poetryService.getPoetryCompetitionByEventSlug(params.slug);
    return {
      message: 'Poetry competition fetched successfully',
      data: competition,
    };
  }
}
