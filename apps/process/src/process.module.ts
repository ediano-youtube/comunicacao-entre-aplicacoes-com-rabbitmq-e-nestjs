import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RabbitmqModule } from '@lib/rabbiimq';

import { RmqProcessService } from './process.service';
import { EmailService } from './email.service';
import { NotificationService } from './notification.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RabbitmqModule],
  providers: [RmqProcessService, EmailService, NotificationService],
})
export class RmqProcessModule {}
