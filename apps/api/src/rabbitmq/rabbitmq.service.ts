import { Inject, Injectable } from '@nestjs/common';
import { Channel, Message } from 'amqplib';

import { RabbitMQProviderType } from './rabbitmq.provider';

type Queque = 'email' | 'notifications';
type Exchange = 'amq.direct';
type RoutingKey = 'process';

@Injectable()
export class RabbitmqService {
  private channel: Channel;

  constructor(
    @Inject('RABBITMQ_PROVIDER')
    private readonly rabbitMQProvider: RabbitMQProviderType,
  ) {}

  async start() {
    if (!this.channel) this.channel = await this.rabbitMQProvider;
  }

  async publishInQueue(queue: Queque, message: string) {
    return this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async publishInExchange(
    exchange: Exchange,
    routingKey: RoutingKey,
    message: string,
  ) {
    return this.channel.publish(exchange, routingKey, Buffer.from(message));
  }

  async consume(queue: Queque, callback?: (message: Message) => void) {
    return this.channel.consume(queue, (message) => {
      if (callback) callback(message);
      this.channel.ack(message);
    });
  }
}
