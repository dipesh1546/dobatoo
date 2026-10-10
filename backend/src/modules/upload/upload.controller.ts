import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CloudinaryService } from './cloudinary.service';

import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

class UploadBase64Dto {
  @ApiPropertyOptional({ description: 'Base64 image string with data URL scheme' })
  @IsOptional()
  @IsString()
  image?: string;
}

@ApiTags('Upload')
@Controller()
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post(['registrations/upload-image', 'upload/image'])
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 uploads per min per IP
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|gif)$/i)) {
          return callback(
            new BadRequestException(
              'Only image files (JPEG, PNG, WEBP, GIF) are allowed.',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @ApiOperation({
    summary: 'Upload Participant Photo to Cloudinary',
    description:
      'Uploads participant photo for giveaways/open mic profile to Cloudinary (optional registration step).',
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiResponse({
    status: 200,
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        url: {
          type: 'string',
          example:
            'https://res.cloudinary.com/dobato/image/upload/v123456/dobato_giveaways/sample.jpg',
        },
        message: { type: 'string', example: 'Image uploaded successfully.' },
      },
    },
  })
  async uploadImage(
    @UploadedFile() file?: Express.Multer.File,
    @Body() body?: UploadBase64Dto,
  ): Promise<{ success: boolean; url: string; message: string }> {
    // 1. Multipart file upload
    if (file && file.buffer) {
      const result = await this.cloudinaryService.uploadImage(
        file.buffer,
        file.mimetype,
      );
      return {
        success: true,
        url: result.url,
        message: 'Image uploaded successfully.',
      };
    }

    // 2. Base64 JSON fallback upload
    if (body && body.image && typeof body.image === 'string') {
      const base64Data = body.image.replace(/^data:image\/\w+;base64,/, '');
      const mimeMatch = body.image.match(/^data:(image\/\w+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const buffer = Buffer.from(base64Data, 'base64');

      if (buffer.length > 5 * 1024 * 1024) {
        throw new BadRequestException('Image size exceeds 5MB limit.');
      }

      const result = await this.cloudinaryService.uploadImage(buffer, mimeType);
      return {
        success: true,
        url: result.url,
        message: 'Image uploaded successfully.',
      };
    }

    throw new BadRequestException('Please provide an image file or base64 image data.');
  }
}
