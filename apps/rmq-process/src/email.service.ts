import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';

@Injectable()
export class EmailService implements OnModuleInit {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  async onModuleInit() {
    await this.rabbitmqService.start();
    await this.rabbitmqService.consume('email', (message) => {
      console.log(message.content.toString());

      // save on database
    });
  }
}
