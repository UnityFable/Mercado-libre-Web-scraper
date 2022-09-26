import { NextFunction, Request, Response } from 'express';
import { IErrorCustom } from '../../interfaces/error.interface';

export function logErrors(
  err: IErrorCustom,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('Error:::', err);
  next(err);
}

export function clientErrorHandler(
  err: IErrorCustom,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('Client error handler:::: ', err);
  const errorResponse = {
    code: err.code || 500,
    error: err.error || err.message || 'An error ocurrs',
  };
  res.status(500).json(errorResponse);
}

export function notFound(req: Request, res: Response, next: NextFunction) {
  const message404: Partial<IErrorCustom> = {
    code: 404,
    error: 'route not found',
  };
  next(message404);
}

module.exports = {
  clientErrorHandler,
  logErrors,
  notFound,
};
