import { ConfigService } from '@nestjs/config';
import { connect, Connection } from 'amqplib';

export const RabbitMQProvider = {
  provide: 'RABBITMQ_PROVIDER',
  useFactory: async (configService: ConfigService) => {
    const uri = configService.get<string>('RABBITMQ_URI');
    return () => connect(uri);
  },
  inject: [ConfigService],
};

export type RabbitMQProviderType = () => Promise<Connection>;
