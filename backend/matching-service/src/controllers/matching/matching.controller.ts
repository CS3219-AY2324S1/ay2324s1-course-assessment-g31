import { Request, Response } from "express";
import { validationResult } from "express-validator";

import MatchingProducer from "../../events/producers/matching/producer";
import MatchingParser from "../../parsers/matching/matching.parser";
import MatchingService from "../../services/matching/matching.service";
import Controller from "../controller.abstract";
import CRUDController from "../crudController.interface";

class MatchingController extends Controller implements CRUDController {
  constructor(
    private readonly service: MatchingService,
    private readonly parser: MatchingParser,
    private readonly eventProducer: MatchingProducer,
  ) {
    super();
  }

  public create = async (req: Request, res: Response) => {
    try {
      const parsedMatching = this.parser.parseCreateInput(req.body);
      const matching = await this.service.create(parsedMatching);
      if (matching) {
        this.eventProducer.create(matching);
      }
      return MatchingController.handleSuccess(res, matching);
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
      const parsedId = this.parser.parseFindByIdInput(req.params.id);
      const matching = await this.service.findById(parsedId);
      return MatchingController.handleSuccess(res, matching);
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
      const matching = await this.service.findOne(parsedFindOneInput);
      return MatchingController.handleSuccess(res, matching);
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
      const matchings = await this.service.findAll();
      return MatchingController.handleSuccess(res, matchings);
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
      const parsedId = this.parser.parseFindByIdInput(req.params.id);
      const parsedUpdateInput = this.parser.parseUpdateInput(req.body);
      const matching = await this.service.update(parsedId, parsedUpdateInput);
      if (matching) {
        this.eventProducer.update(matching);
      }
      return MatchingController.handleSuccess(res, matching);
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
      const parsedId = this.parser.parseFindByIdInput(req.params.id);
      const matching = await this.service.delete(parsedId);
      if (matching) {
        this.eventProducer.delete(matching);
      }
      return MatchingController.handleSuccess(res, matching);
    } catch (e: any) {
      return MatchingController.handleBadRequest(res, e.message);
    }
  };
}

export default MatchingController;
