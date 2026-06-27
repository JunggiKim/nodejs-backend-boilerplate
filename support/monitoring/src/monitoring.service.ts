import { Injectable, Logger } from '@nestjs/common';
import { HealthCheckService, HealthCheck, HealthCheckResult, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '@ext/database';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);

  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
  ) {}

  @HealthCheck()
  async checkHealth(): Promise<HealthCheckResult> {
    this.logger.log('Performing health check');
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
    ]);
  }
}
