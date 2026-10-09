import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  private validateDatabaseUrl(): void {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl || typeof databaseUrl !== 'string' || databaseUrl.trim() === '') {
      throw new Error('DATABASE_URL is missing or does not contain a MongoDB database name.');
    }

    try {
      const parsed = new URL(databaseUrl);
      const isMongo =
        parsed.protocol === 'mongodb:' || parsed.protocol === 'mongodb+srv:';
      const dbName = parsed.pathname ? parsed.pathname.replace(/^\//, '').trim() : '';

      if (!isMongo || !dbName) {
        throw new Error('DATABASE_URL is missing or does not contain a MongoDB database name.');
      }
    } catch {
      throw new Error('DATABASE_URL is missing or does not contain a MongoDB database name.');
    }
  }

  private sanitizeErrorMessage(msg: string): string {
    // Strip any mongodb URI, user/pass credentials
    return msg.replace(/mongodb(\+srv)?:\/\/[^@\s]+@/gi, 'mongodb$1://***:***@');
  }

  async onModuleInit(): Promise<void> {
    this.validateDatabaseUrl();

    // Connect asynchronously so application startup and HTTP listeners are not blocked
    this.$connect()
      .then(async () => {
        await this.$runCommandRaw({ ping: 1 });
        this.logger.log('Successfully connected to MongoDB database via Prisma.');
      })
      .catch((error: unknown) => {
        const rawMessage = error instanceof Error ? error.message : String(error);
        const message = this.sanitizeErrorMessage(rawMessage);
        this.logger.warn(`Could not connect to MongoDB database on startup: ${message}`);
      });
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.$disconnect();
      this.logger.log('Disconnected from MongoDB database.');
    } catch (error: unknown) {
      const rawMessage = error instanceof Error ? error.message : String(error);
      const message = this.sanitizeErrorMessage(rawMessage);
      this.logger.error(`Failed to disconnect from MongoDB database: ${message}`);
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      this.validateDatabaseUrl();
      const pingPromise = this.$runCommandRaw({ ping: 1 });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Health check ping timed out')), 2000),
      );
      await Promise.race([pingPromise, timeoutPromise]);
      return true;
    } catch (error: unknown) {
      const rawMessage = error instanceof Error ? error.message : String(error);
      const message = this.sanitizeErrorMessage(rawMessage);
      this.logger.warn(`MongoDB health check ping failed: ${message}`);
      return false;
    }
  }
}