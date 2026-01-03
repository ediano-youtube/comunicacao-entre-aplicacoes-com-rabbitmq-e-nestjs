import { Injectable } from '@nestjs/common';
import { RabbitmqService } from '@app/rabbitmq';

@Injectable()
export class NotificationService {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  async onModuleInit() {
    await this.rabbitmqService.createAssert('notifications');
    await this.rabbitmqService.consume('notifications', async (message) => {
      console.log(message.content.toString());

      // save on database
    });
  }
}
