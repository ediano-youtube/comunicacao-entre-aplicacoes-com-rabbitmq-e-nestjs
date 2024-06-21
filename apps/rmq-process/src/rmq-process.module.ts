import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RmqProcessService } from './rmq-process.service';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { EmailService } from './email.service';
import { NotificationService } from './notification.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RabbitmqModule],
  providers: [RmqProcessService, EmailService, NotificationService],
})
export class RmqProcessModule {}
