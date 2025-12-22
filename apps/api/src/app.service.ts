import { Injectable } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';

@Injectable()
export class AppService {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  async defaultNestJS() {
    return;
  }

  async queue() {
    await this.rabbitmqService.start();
    const data = { message: 'Email enviado para queue' };
    await this.rabbitmqService.publishInQueue('email', JSON.stringify(data));
  }

  async exchange() {
    await this.rabbitmqService.start();
    const data = {
      message: 'Enviando informações para exchange (email and notifications)',
    };
    await this.rabbitmqService.publishInExchange(
      'amq.direct',
      'api-to-process',
      JSON.stringify(data),
    );
  }
}
