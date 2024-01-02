import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.port || 3000;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/v1');
  await app.listen(port);
  Logger.log(`🚀 Application is running in port http://localhost:${port}/v1`);
}
bootstrap();
