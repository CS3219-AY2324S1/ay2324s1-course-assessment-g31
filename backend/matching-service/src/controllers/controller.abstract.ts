import { Request, Response } from "express";
import { Result, ValidationError } from "express-validator";
import httpStatus from "http-status";

abstract class Controller {
  constructor() {}

  protected static handleValidationError(
    res: Response,
    errors: Result<ValidationError>
  ) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
  }

  protected static handleSuccess(res: Response, data: any) {
    return res.status(httpStatus.OK).json(data);
  }

  protected static handleBadRequest(res: Response, message: string) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      errors: message,
    });
  }

  public healthCheck(_req: Request, res: Response) {
    console.log("Health Check");
    return Controller.handleSuccess(res, { message: "OK" });
  }
}

export default Controller;
