import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // /api/v1으로 prefix
  app.setGlobalPrefix('api/v1');

  // Swagger 생성
  const config = new DocumentBuilder()
    .setTitle('blockchain-api')
    .setDescription('block chain api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // cors 해결
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
