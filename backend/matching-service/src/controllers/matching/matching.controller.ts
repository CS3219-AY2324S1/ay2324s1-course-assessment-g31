import { Request, Response } from "express";
import { validationResult } from "express-validator";

import MatchingParser from "../../parsers/matching/matching.parser";
import MatchingService from "../../services/matching/matching.service";
import Controller from "../controller.abstract";
import CRUDController from "../crudController.interface";

class MatchingController extends Controller implements CRUDController {
  constructor(
    private readonly service: MatchingService,
    private readonly parser: MatchingParser
  ) {
    super();
  }

  public create = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingController.handleValidationError(res, errors);
    }
    try {
      const parsedMatchingRequest = this.parser.parseCreateInput(req.body);
      const matchingRequest = await this.service.create(parsedMatchingRequest);
      return MatchingController.handleSuccess(res, matchingRequest);
    } catch (e: any) {
      return MatchingController.handleBadRequest(res, e.message);
    }
  };

  public findById = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingController.handleValidationError(res, errors);
    }

    try {
      const parsedId = this.parser.parseFindByIdInput(req.params["id"]);
      const matchingRequest = await this.service.findById(parsedId);
      return MatchingController.handleSuccess(res, matchingRequest);
    } catch (e: any) {
      return MatchingController.handleBadRequest(res, e.message);
    }
  };

  public findOne = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingController.handleValidationError(res, errors);
    }

    try {
      const parsedFindOneInput = this.parser.parseFindOneInput(req.body);
      const matchingRequest = await this.service.findOne(parsedFindOneInput);
      return MatchingController.handleSuccess(res, matchingRequest);
    } catch (e: any) {
      return MatchingController.handleBadRequest(res, e.message);
    }
  };

  public findAll = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingController.handleValidationError(res, errors);
    }

    try {
      const matchingRequests = this.service.findAll();
      return MatchingController.handleSuccess(res, matchingRequests);
    } catch (e: any) {
      return MatchingController.handleBadRequest(res, e.message);
    }
  };

  public update = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingController.handleValidationError(res, errors);
    }

    try {
      const parsedId = this.parser.parseFindByIdInput(req.params["id"]);
      const parsedUpdateInput = this.parser.parseUpdateInput(req.body);
      const matchingRequest = this.service.update(parsedId, parsedUpdateInput);
      return MatchingController.handleSuccess(res, matchingRequest);
    } catch (e: any) {
      return MatchingController.handleBadRequest(res, e.message);
    }
  };

  public delete = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingController.handleValidationError(res, errors);
    }

    try {
      const parsedId = this.parser.parseFindByIdInput(req.params["id"]);
      const matchingRequest = this.service.delete(parsedId);
      return MatchingController.handleSuccess(res, matchingRequest);
    } catch (e: any) {
      return MatchingController.handleBadRequest(res, e.message);
    }
  };
}

export default MatchingController;
