import { Request, Response } from "express";

import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
} from "@nestjs/common";

import { HTTP_RESPONSES, SupportedLangs } from "../responses/http.responses";

@Catch(HttpException)
export class I18nExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const rawLang = request.headers["accept-language"];
    let lang = rawLang?.substring(0, 2) as SupportedLangs;

    if (!HTTP_RESPONSES[lang]) lang = "en";

    let errorBody: Record<string, unknown> = {};

    if (typeof exceptionResponse === "string") {
      errorBody = { message: exceptionResponse };
    }

    if (typeof exceptionResponse === "object") {
      errorBody = { ...exceptionResponse };
    }

    const errorCode = errorBody.errorCode as string;

    delete errorBody.errorCode;

    if (errorCode) {
      const msg = HTTP_RESPONSES[lang][errorCode] as Record<string, unknown>;

      if (msg) errorBody.message = msg.message;
    }

    response.status(status).json({
      errorCode,
      ...errorBody,
      metadata: {
        statusCode: status,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
