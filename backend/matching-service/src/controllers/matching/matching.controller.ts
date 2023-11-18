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
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingController.handleValidationError(res, errors);
    }

    let parsedMatching, matching;
    try {
      parsedMatching = this.parser.parseCreateInput(req.body);
    } catch (parserError: any) {
      return MatchingController.handleBadRequest(res, parserError.message);
    }

    try {
      matching = await this.service.create(parsedMatching);
      if (!matching) {
        return MatchingController.handleError(
          res,
          "Service did not return matching after create",
        );
      }
      await this.eventProducer.create(matching);
      return MatchingController.handleSuccess(res, matching);
    } catch (serviceError: any) {
      if (serviceError instanceof Error) {
        return MatchingController.handleError(res, serviceError.message);
      }
      return MatchingController.handleError(
        res,
        "Unknown Service Error: Matching Create",
      );
    }
  };

  public findById = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingController.handleValidationError(res, errors);
    }

    let parsedId, matching;
    try {
      parsedId = this.parser.parseFindByIdInput(req.params.id);
    } catch (parserError: any) {
      return MatchingController.handleBadRequest(res, parserError.message);
    }

    try {
      matching = await this.service.findById(parsedId);
    } catch (serviceError: any) {
      if (serviceError instanceof Error) {
        return MatchingController.handleError(res, serviceError.message);
      }
      return MatchingController.handleError(
        res,
        "Unknown Service Error: Matching Find By Id",
      );
    }
    if (matching) {
      return MatchingController.handleSuccess(res, matching);
    }

    return MatchingController.handleNotFound(res, "Matching Was Not Found");
  };

  public findOne = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingController.handleValidationError(res, errors);
    }

    let parsedFindOneInput, matching;
    try {
      parsedFindOneInput = this.parser.parseFindOneInput(req.body);
    } catch (parserError: any) {
      return MatchingController.handleBadRequest(res, parserError.message);
    }

    try {
      matching = await this.service.findOne(parsedFindOneInput);
    } catch (serviceError: any) {
      if (serviceError instanceof Error) {
        return MatchingController.handleError(res, serviceError.message);
      }
      return MatchingController.handleError(
        res,
        "Unknown Service Error: Matching Find One",
      );
    }
    if (matching) {
      return MatchingController.handleSuccess(res, matching);
    }

    return MatchingController.handleNotFound(res, "Matching Was Not Found");
  };

  public findAll = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingController.handleValidationError(res, errors);
    }

    try {
      const matchings = await this.service.findAll();
      return MatchingController.handleSuccess(res, matchings);
    } catch (serviceError: any) {
      if (serviceError instanceof Error) {
        return MatchingController.handleError(res, serviceError.message);
      }
      return MatchingController.handleError(
        res,
        "Unknown Service Error: Matching Find All",
      );
    }
  };

  public update = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingController.handleValidationError(res, errors);
    }

    let parsedId, parsedUpdateInput, matching;
    try {
      parsedId = this.parser.parseFindByIdInput(req.params.id);
    } catch (parserError: any) {
      return MatchingController.handleBadRequest(res, parserError.message);
    }

    try {
      parsedUpdateInput = this.parser.parseUpdateInput(req.body);
    } catch (parserError: any) {
      return MatchingController.handleBadRequest(res, parserError.message);
    }

    try {
      matching = await this.service.update(parsedId, parsedUpdateInput);
      if (!matching) {
        return MatchingController.handleError(
          res,
          "Service did not return matching after update",
        );
      }
      await this.eventProducer.update(matching);
      return MatchingController.handleSuccess(res, matching);
    } catch (serviceError: any) {
      if (serviceError instanceof Error) {
        return MatchingController.handleError(res, serviceError.message);
      }
      return MatchingController.handleError(
        res,
        "Unknown Service Error: Matching Update",
      );
    }
  };

  public delete = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingController.handleValidationError(res, errors);
    }

    let parsedId, matching;
    try {
      parsedId = this.parser.parseFindByIdInput(req.params.id);
    } catch (parserError: any) {
      return MatchingController.handleBadRequest(res, parserError.message);
    }

    try {
      matching = await this.service.delete(parsedId);
      if (!matching) {
        return MatchingController.handleError(
          res,
          "Service did not return matching after delete",
        );
      }
      await this.eventProducer.delete(matching);
      return MatchingController.handleSuccess(res, matching);
    } catch (serviceError: any) {
      if (serviceError instanceof Error) {
        return MatchingController.handleError(res, serviceError.message);
      }
      return MatchingController.handleError(
        res,
        "Unknown Service Error: Matching Delete",
      );
    }
  };
}

export default MatchingController;
