import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EventService } from './event.service';
import { EventSlugParamDto } from './dto/event-param.dto';
import { ExtendedPublicEventResponseDto } from './dto/event-response.dto';

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Active Public Event Details',
    description:
      'Retrieves the currently active public DOBATO launch event details including highlights, prizes, poetry competition info, guidelines, FAQs, and performances.',
  })
  @ApiResponse({
    status: 200,
    description: 'Active event fetched successfully',
    type: ExtendedPublicEventResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No active event currently available',
  })
  async getActiveEvent(): Promise<{ message: string; data: ExtendedPublicEventResponseDto }> {
    const event = await this.eventService.getActiveEvent();
    return {
      message: 'Event fetched successfully',
      data: event,
    };
  }

  @Get(':slug')
  @ApiOperation({
    summary: 'Get Event Details by Slug',
    description: 'Retrieves public event details matching the provided unique slug identifier.',
  })
  @ApiParam({
    name: 'slug',
    description: 'Unique URL slug of the event',
    example: 'dobato-grand-launch',
  })
  @ApiResponse({
    status: 200,
    description: 'Event details fetched successfully',
    type: ExtendedPublicEventResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Event with the specified slug was not found or is inactive',
  })
  async getEventBySlug(
    @Param() params: EventSlugParamDto,
  ): Promise<{ message: string; data: ExtendedPublicEventResponseDto }> {
    const event = await this.eventService.getEventBySlug(params.slug);
    return {
      message: 'Event fetched successfully',
      data: event,
    };
  }
}
