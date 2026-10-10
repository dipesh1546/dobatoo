import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private isConfigured = false;

  constructor(private readonly configService: ConfigService) {
    const cloudinaryUrl =
      this.configService.get<string>('CLOUDINARY_URL') ||
      process.env.CLOUDINARY_URL;

    const cloudName =
      this.configService.get<string>('cloudinary.cloudName') ||
      this.configService.get<string>('CLOUDINARY_CLOUD_NAME') ||
      process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey =
      this.configService.get<string>('cloudinary.apiKey') ||
      this.configService.get<string>('CLOUDINARY_API_KEY') ||
      process.env.CLOUDINARY_API_KEY;
    const apiSecret =
      this.configService.get<string>('cloudinary.apiSecret') ||
      this.configService.get<string>('CLOUDINARY_API_SECRET') ||
      process.env.CLOUDINARY_API_SECRET;

    if (cloudinaryUrl && cloudinaryUrl.startsWith('cloudinary://')) {
      cloudinary.config({
        secure: true,
      });
      this.isConfigured = true;
      this.logger.log('✅ Cloudinary configured successfully via CLOUDINARY_URL.');
    } else if (cloudName && apiKey && apiSecret && !cloudName.includes('your_')) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.isConfigured = true;
      this.logger.log(`✅ Cloudinary configured successfully for cloud: ${cloudName}`);
    } else {
      this.logger.warn(
        '⚠️ Cloudinary Cloud Name is needed (or CLOUDINARY_URL). API Key and Secret are loaded.',
      );
    }
  }

  /**
   * Upload an image file buffer or base64 string to Cloudinary.
   */
  async uploadImage(
    fileBuffer: Buffer,
    mimetype: string = 'image/jpeg',
    folder: string = 'dobato_giveaways',
  ): Promise<{ url: string; publicId?: string }> {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new BadRequestException('No image file provided for upload.');
    }

    // If Cloudinary credentials are configured, upload to Cloudinary
    if (this.isConfigured) {
      try {
        const uploadResult = await new Promise<UploadApiResponse>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder,
                resource_type: 'image',
                transformation: [
                  { width: 1000, height: 1000, crop: 'limit' },
                  { quality: 'auto:good' },
                  { fetch_format: 'auto' },
                ],
              },
              (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error) return reject(error);
                if (!result) return reject(new Error('Cloudinary returned empty result.'));
                resolve(result);
              },
            );

            uploadStream.end(fileBuffer);
          },
        );

        return {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        };
      } catch (err: any) {
        this.logger.warn(
          `Cloudinary upload failed (${err.message}). Storing robust base64 Data URL fallback.`,
        );
        const base64Data = fileBuffer.toString('base64');
        const dataUrl = `data:${mimetype};base64,${base64Data}`;
        return {
          url: dataUrl,
        };
      }
    }

    // Fallback if Cloudinary is not configured yet: return safe base64 Data URL for local dev
    this.logger.log('Returning base64 data URL fallback since Cloudinary credentials are not set.');
    const base64Data = fileBuffer.toString('base64');
    const dataUrl = `data:${mimetype};base64,${base64Data}`;
    return {
      url: dataUrl,
    };
  }
}
