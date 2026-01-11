import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Channel, Connection, ConsumeMessage, Message } from 'amqplib';
import { RabbitMQProviderType } from './rabbitmq.provider';

type Queque = 'email' | 'notifications';
type Exchange = 'amq.direct';
type RoutingKey = 'process';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private channel: Channel;

  constructor(
    @Inject('RABBITMQ_PROVIDER')
    private readonly rabbitMQProvider: RabbitMQProviderType,
  ) {}

  async onModuleInit() {
    this.connection = await this.rabbitMQProvider();
    if (this.connection) {
      this.channel = await this.connection.createChannel();
    }
  }

  async onModuleDestroy() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
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

  async createAssert(queue: string) {
    const retryExchange = `retry_${queue}`;
    await this.channel.assertExchange(retryExchange, 'direct', {
      durable: true,
    });

    await this.channel.assertQueue(queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': retryExchange,
        'x-dead-letter-routing-key': queue,
      },
    });

    const retryQueue = `retry_${queue}`;
    await this.channel.assertQueue(retryQueue, {
      durable: true,
      arguments: {
        'x-message-ttl': 5000,
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': queue,
      },
    });

    await this.channel.bindQueue(retryQueue, retryExchange, queue);
  }

  private async onConsume(
    message: ConsumeMessage,
    onMessage: (msg: ConsumeMessage | null) => Promise<void>,
    options: any,
  ) {
    const maxRetries = options?.maxRetries || 2;
    const xDeath = message?.properties?.headers?.['x-death'];
    const retryCount = xDeath ? xDeath[0].count : 0;

    try {
      if (onMessage) {
        await onMessage(message);
      }

      this.channel.ack(message);
      return;
    } catch (_error) {
      if (retryCount > maxRetries) {
        this.channel.ack(message);
        // email
        return;
      }

      this.channel.nack(message, false, false);
    }

    return;
  }

  async consume(
    queue: Queque,
    callback?: (message: Message) => Promise<void>,
    options = { maxRetries: 2 },
  ) {
    const onConsumeMessage = async (message: ConsumeMessage) => {
      return this.onConsume(message, callback, options);
    };

    return this.channel.consume(queue, onConsumeMessage);
  }
}
