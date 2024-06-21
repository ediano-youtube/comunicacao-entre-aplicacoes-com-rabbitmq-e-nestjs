import { Injectable } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';

@Injectable()
export class NotificationService {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  async onModuleInit() {
    await this.rabbitmqService.start();
    await this.rabbitmqService.consume('notifications', (message) => {
      console.log(message.content.toString());

      // save on database
    });
  }
}
