import { Injectable } from '@nestjs/common';

import { RabbitmqService } from '@lib/rabbiimq';

@Injectable()
export class NotificationService {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  async onModuleInit() {
    await this.rabbitmqService.createAssert('notifications');
    await this.rabbitmqService.consume(
      'notifications',
      async (message) => {
        console.log(message.content.toString());

        await new Promise((resolve) => setTimeout(resolve, 2000));

        throw new Error('Test error');

        // save on database
      },
      { maxRetries: 5 },
    );
  }
}
