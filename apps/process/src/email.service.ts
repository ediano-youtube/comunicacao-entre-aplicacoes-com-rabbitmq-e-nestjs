import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitmqService } from '@app/rabbitmq';

@Injectable()
export class EmailService implements OnModuleInit {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  async onModuleInit() {
    await this.rabbitmqService.createAssert('email');
    await this.rabbitmqService.consume('email', async (message) => {
      console.log(message.content.toString());

      throw new Error('test error');

      // save on database
    });
  }
}
