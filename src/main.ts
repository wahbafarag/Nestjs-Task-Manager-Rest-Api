import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap ');
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || serverConfig.port);
  logger.log('Application is running on port 3000 by default');
}
bootstrap();
