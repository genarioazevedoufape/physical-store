import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Physical-Store API')
    .setDescription('Documentação da API da aplicação')
    .setVersion('1.0')
    .addTag('Stores')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  writeFileSync('./swagger.json', JSON.stringify(document));

  await app.listen(3000);
}
bootstrap();
