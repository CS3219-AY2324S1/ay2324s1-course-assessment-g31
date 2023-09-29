import { Request, Response } from "express";
import { validationResult } from "express-validator";

import MatchingRequestParser from "../../parsers/matchingRequest/matchingRequest.parser";
import MatchingRequestService from "../../services/matchingRequest/matchingRequest.service";
import Controller from "../controller.abstract";
import CRUDController from "../crudController.interface";

class MatchingRequestController extends Controller implements CRUDController {
  constructor(
    private readonly service: MatchingRequestService,
    private readonly parser: MatchingRequestParser
  ) {
    super();
  }

  public create = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingRequestController.handleValidationError(res, errors);
    }
    try {
      const parsedMatchingRequest = this.parser.parseCreateInput(req.body);
      const matchingRequest = await this.service.create(parsedMatchingRequest);
      return MatchingRequestController.handleSuccess(res, matchingRequest);
    } catch (e: any) {
      return MatchingRequestController.handleBadRequest(res, e.message);
    }
  };

  public findById = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingRequestController.handleValidationError(res, errors);
    }

    try {
      const parsedId = this.parser.parseFindByIdInput(req.params["id"]);
      const matchingRequest = await this.service.findById(parsedId);
      return MatchingRequestController.handleSuccess(res, matchingRequest);
    } catch (e: any) {
      return MatchingRequestController.handleBadRequest(res, e.message);
    }
  };

  public findOne = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingRequestController.handleValidationError(res, errors);
    }

    try {
      const parsedFindOneInput = this.parser.parseFindOneInput(req.body);
      const matchingRequest = await this.service.findOne(parsedFindOneInput);
      return MatchingRequestController.handleSuccess(res, matchingRequest);
    } catch (e: any) {
      return MatchingRequestController.handleBadRequest(res, e.message);
    }
  };

  public findAll = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingRequestController.handleValidationError(res, errors);
    }

    try {
      const matchingRequests = this.service.findAll();
      return MatchingRequestController.handleSuccess(res, matchingRequests);
    } catch (e: any) {
      return MatchingRequestController.handleBadRequest(res, e.message);
    }
  };

  public update = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingRequestController.handleValidationError(res, errors);
    }

    try {
      const parsedId = this.parser.parseFindByIdInput(req.params["id"]);
      const parsedUpdateInput = this.parser.parseUpdateInput(req.body);
      const matchingRequest = this.service.update(parsedId, parsedUpdateInput);
      return MatchingRequestController.handleSuccess(res, matchingRequest);
    } catch (e: any) {
      return MatchingRequestController.handleBadRequest(res, e.message);
    }
  };

  public delete = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingRequestController.handleValidationError(res, errors);
    }

    try {
      const parsedId = this.parser.parseFindByIdInput(req.params["id"]);
      const matchingRequest = this.service.delete(parsedId);
      return MatchingRequestController.handleSuccess(res, matchingRequest);
    } catch (e: any) {
      return MatchingRequestController.handleBadRequest(res, e.message);
    }
  };
}

export default MatchingRequestController;
