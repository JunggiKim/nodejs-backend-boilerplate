import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheckResult } from '@nestjs/terminus';
import { MonitoringService } from './monitoring.service';

@ApiTags('Monitoring')
@Controller('health')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get()
  @ApiOperation({ summary: '헬스 체크', description: '애플리케이션 및 DB 상태를 검증합니다' })
  async getHealth(): Promise<HealthCheckResult> {
    return this.monitoringService.checkHealth();
  }
}
