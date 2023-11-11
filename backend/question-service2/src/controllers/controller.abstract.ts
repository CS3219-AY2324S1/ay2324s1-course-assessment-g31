import { Request, Response } from "express";
import { Result, ValidationError } from "express-validator";
import httpStatus from "http-status";

export type DataRecord<U> = { data: U; count: number };

abstract class Controller {
  protected static handleValidationError(
    res: Response,
    errors: Result<ValidationError>,
  ) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array().map((x) => x.msg),
    });
  }

  protected static handleSuccess<T>(res: Response, data: DataRecord<T>) {
    return res.status(httpStatus.OK).json(data);
  }

  protected static handleBadRequest(res: Response, message: string) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      errors: message,
    });
  }

  protected static handleNotFound(res: Response, message: string) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      errors: message,
    });
  }

  protected static handleError(res: Response, message: string) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      errors: message,
    });
  }

  public healthCheck(_req: Request, res: Response) {
    return Controller.handleSuccess<string>(res, { data: "OK", count: 0 });
  }
}

export default Controller;
