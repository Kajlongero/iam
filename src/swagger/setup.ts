import { INestApplication } from "@nestjs/common";

import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle("IAM Core")
    .setDescription("IAM API description")
    .setVersion("1.0")
    .addTag("IAM")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);
};
