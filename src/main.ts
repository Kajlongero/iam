import { Logger } from "nestjs-pino";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { setupSwagger } from "./swagger/setup";

import { AppModule } from "./app.module";
import { PrismaExceptionFilter } from "./prisma/filters/prisma.filters";
import { I18nExceptionFilter } from "./commons/filters/i18n-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.useGlobalFilters(new PrismaExceptionFilter(), new I18nExceptionFilter());

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
