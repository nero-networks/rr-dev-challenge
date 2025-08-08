import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule, { cors: true });

  SwaggerModule.setup(
    '/',
    app,
    () =>
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder().setTitle('rr DEV Challenge').build(),
      ),
    {
      jsonDocumentUrl: 'openapi.json',
      yamlDocumentUrl: 'openapi.yaml',
    },
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  Logger.log(`Fahrplan backend is running on port ${port}`, 'Main');
})().catch((e) => Logger.error(e));
