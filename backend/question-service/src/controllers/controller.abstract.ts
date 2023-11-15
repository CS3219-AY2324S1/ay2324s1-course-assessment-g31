import { Request, Response } from "express";
import { Result, ValidationError } from "express-validator";
import httpStatus from "http-status";
import { DataRecord } from "../interfaces/dataRecord";

type ControllerResponse = {
  success: boolean;
  errors: string[];
  data: any;
};

abstract class Controller {
  protected static handleValidationError(
    res: Response,
    errors: Result<ValidationError>,
  ) {
    const result: ControllerResponse = {
      success: false,
      errors: errors.array().map((x) => x.msg),
      data: undefined,
    };
    return res.status(httpStatus.BAD_REQUEST).json(result);
  }

  protected static handleSuccess<T>(res: Response, data: DataRecord<T>) {
    const result: ControllerResponse = {
      success: true,
      errors: [],
      data,
    };
    return res.status(httpStatus.OK).json(result);
  }

  protected static handleBadRequest(res: Response, message: string) {
    const result: ControllerResponse = {
      success: false,
      errors: [message],
      data: null,
    };
    return res.status(httpStatus.BAD_REQUEST).json(result);
  }

  protected static handleNotFound(res: Response, message: string) {
    const result: ControllerResponse = {
      success: false,
      errors: [message],
      data: null,
    };
    return res.status(httpStatus.NOT_FOUND).json(result);
  }

  protected static handleError(res: Response, message: string) {
    const result: ControllerResponse = {
      success: false,
      errors: [message],
      data: null,
    };
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result);
  }

  public healthCheck(_req: Request, res: Response) {
    return Controller.handleSuccess<string>(res, { data: "OK", count: 0 });
  }
}

export default Controller;
