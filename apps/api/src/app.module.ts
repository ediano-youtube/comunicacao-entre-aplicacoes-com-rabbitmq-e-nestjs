import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RabbitmqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
