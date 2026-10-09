import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class EventSlugParamDto {
  @ApiProperty({
    description: 'Unique URL-friendly slug identifier for the event',
    example: 'dobato-grand-launch',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase alphanumeric characters and hyphens',
  })
  slug: string;
}
