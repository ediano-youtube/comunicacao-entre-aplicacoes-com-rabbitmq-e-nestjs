import { NestFactory } from '@nestjs/core';
import { RmqProcessModule } from './process.module';

async function bootstrap() {
  const app = await NestFactory.create(RmqProcessModule);
  await app.init();
}
bootstrap();
