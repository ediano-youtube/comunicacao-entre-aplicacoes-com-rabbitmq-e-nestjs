import { Module } from '@nestjs/common';

import { RabbitmqService } from './rabbitmq.service';
import { RabbitMQProvider } from './rabbitmq.provider';

@Module({
  providers: [RabbitmqService, RabbitMQProvider],
  exports: [RabbitmqService, RabbitMQProvider],
})
export class RabbitmqModule {}
