import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';
import { HttpLoggingInterceptor } from './shared/infrastructure/http/logging.interceptor';
import { AllExceptionsFilter } from './shared/infrastructure/http/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // Serve uploaded files (local storage)
  app.use(
    '/uploads',
    express.static(path.resolve(process.cwd(), 'uploads'), {
      fallthrough: false,
    }),
  );

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new HttpLoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('hr-crm API')
    .setDescription('hr-crm API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Can be also specified in `.env` file
  await app.listen(process.env.PORT ?? 5000);
}
void bootstrap();
