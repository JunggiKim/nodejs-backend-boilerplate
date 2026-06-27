import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from '@app/database';
import { validationSchema } from '@app/web-infra';
import { UsersModule } from './users/users.module';
import { MonitoringModule } from '@support/monitoring';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      envFilePath: ['.env'],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: (_req, _res) => ({
          context: 'HTTP',
        }),
        transport:
          process.env['NODE_ENV'] !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
        level: process.env['LOG_LEVEL'] ?? 'info',
      },
    }),
    PrismaModule,
    UsersModule,
    MonitoringModule,
  ],
})
export class AppModule {}
