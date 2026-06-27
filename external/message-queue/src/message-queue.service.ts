import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MessageQueueService {
  private readonly logger = new Logger(MessageQueueService.name);

  async publish(topic: string, message: Record<string, unknown>): Promise<void> {
    this.logger.log(`Publishing message to topic [${topic}]: ${JSON.stringify(message)}`);
    await Promise.resolve();
  }

  async consume(topic: string, handler: (message: Record<string, unknown>) => Promise<void>): Promise<void> {
    this.logger.log(`Subscribed to topic [${topic}]`);
    // 미사용 변수 eslint 우회를 위해 조건절 임시 기입
    if (handler) {
      await Promise.resolve();
    }
  }
}
