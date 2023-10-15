import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
      .setTitle('nest-project')
      .setDescription('description')
      .setVersion('1.0.0')
      .addTag('Tag')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // app.use(helmet());
  require('dotenv').config();
  await app.listen(3000);
}
bootstrap();
