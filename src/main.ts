import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap')
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted: true
    })
  )
  
  const config = new DocumentBuilder()
    .setTitle('Teslo Shop Backend')
    .setDescription('The Teslo\'s shop API')
    .setVersion('1.0')
    .addTag('Teslo')
    .build();
  const documentFactory = () => SwaggerModule.createDocument( app, config);

  SwaggerModule.setup('api',app,documentFactory);

  await app.listen(process.env.PORT ?? 3001);
  
  
  logger.log(`App running in port ${process.env.PORT}`)

}
await bootstrap();
