import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

export interface HealthCheckResult {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    environment: string;
    uptime: number;
    database: {
      status: 'up' | 'down';
    };
  };
}

@Injectable()
export class HealthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async checkHealth(): Promise<HealthCheckResult> {
    const isDbHealthy = await this.prismaService.isHealthy();
    const env = this.configService.get<string>('NODE_ENV', 'development');

    return {
      success: true,
      message: 'DOBATO API is running',
      timestamp: new Date().toISOString(),
      data: {
        environment: env,
        uptime: process.uptime(),
        database: {
          status: isDbHealthy ? 'up' : 'down',
        },
      },
    };
  }

  async checkLiveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  async checkReadiness() {
    const isDbHealthy = await this.prismaService.isHealthy();
    if (!isDbHealthy) {
      throw new ServiceUnavailableException('Database dependency is unavailable.');
    }
    return {
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    };
  }
}
