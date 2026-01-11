import { Injectable } from '@nestjs/common';

import { RabbitmqService } from '@lib/rabbiimq';

@Injectable()
export class AppService {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  async defaultNestJS() {
    return;
  }

  async queue() {
    const data = { message: 'Email enviado para queue' };
    await this.rabbitmqService.publishInQueue('email', JSON.stringify(data));
  }

  async exchange() {
    const data = {
      message: 'Enviando informações para exchange (email and notifications)',
    };
    await this.rabbitmqService.publishInExchange(
      'amq.direct',
      'process',
      JSON.stringify(data),
    );
  }
}
