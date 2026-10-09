import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService, HealthCheckResult } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Check API and Database Health',
    description: 'Returns the operational health status of the DOBATO API and connected database service.',
  })
  @ApiResponse({ status: 200, description: 'API is running successfully' })
  async getHealth(): Promise<HealthCheckResult> {
    return this.healthService.checkHealth();
  }

  @Get('live')
  @ApiOperation({
    summary: 'Liveness probe check',
    description: 'Verifies the application process is running.',
  })
  @ApiResponse({ status: 200, description: 'Application process is alive.' })
  async getLiveness() {
    return this.healthService.checkLiveness();
  }

  @Get('ready')
  @ApiOperation({
    summary: 'Readiness probe check',
    description: 'Verifies the application can communicate with required dependencies (e.g. database).',
  })
  @ApiResponse({ status: 200, description: 'Application is ready to serve traffic.' })
  @ApiResponse({ status: 503, description: 'Required dependencies are unavailable.' })
  async getReadiness() {
    return this.healthService.checkReadiness();
  }
}
