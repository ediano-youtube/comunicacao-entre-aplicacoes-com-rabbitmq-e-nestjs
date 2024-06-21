import { NestFactory } from '@nestjs/core';
import { RmqProcessModule } from './rmq-process.module';

async function bootstrap() {
  const app = await NestFactory.create(RmqProcessModule);
  await app.init();
}
bootstrap();
