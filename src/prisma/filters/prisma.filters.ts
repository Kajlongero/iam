import { Request, Response } from "express";
import { Catch, ArgumentsHost, ExceptionFilter } from "@nestjs/common";

import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";

import { PRISMA_EXCEPTION_CONSTANTS } from "../exceptions/exceptions.constants";

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    switch (exception.code) {
      case "P2002":
        return this.conflictException(req, res, exception);
      default:
        return this.internalException(req, res);
    }
  }

  conflictException(
    req: Request,
    res: Response,
    exception: PrismaClientKnownRequestError
  ) {
    const message: string = this.retrieveErrorMessageFromException(exception);

    return res.status(409).json({
      error: "Conflict",
      message: message,
      statusCode: 409,
    });
  }

  internalException(req: Request, res: Response) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Internal Server Error",
      statusCode: 500,
    });
  }

  private retrieveErrorMessageFromException(
    exception: PrismaClientKnownRequestError
  ) {
    const object =
      PRISMA_EXCEPTION_CONSTANTS[
        exception.code as keyof typeof PRISMA_EXCEPTION_CONSTANTS
      ];

    const medaModelName = exception.meta?.modelName as keyof typeof object;
    const metaField = exception.meta?.target as string[];

    const field = metaField[0];
    const message = object[medaModelName][field] as string;

    return message;
  }
}
