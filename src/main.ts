import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
<<<<<<< HEAD
=======

  app.enableVersioning({ type: VersioningType.URI });

>>>>>>> 7fd024f (wip/candidates-search)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

<<<<<<< HEAD
  await app.listen(process.env.PORT ?? 5000);
=======
  await app.listen(process.env.PORT ?? 3000);
>>>>>>> 7fd024f (wip/candidates-search)
}
void bootstrap();
