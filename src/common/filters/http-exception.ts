import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const errorMessage = exception.response?.message || exception.message || 'Unexpected error occurred';

    response.status(status).json({
      ok: false,
      msg: errorMessage,
      data: null,
    });
  }
}