import { Request, Response } from "express";
import { validationResult } from "express-validator";

import MatchingRequestParser from "../../parsers/matchingRequest/matchingRequest.parser";
import MatchingRequestService from "../../services/matchingRequest/matchingRequest.service";
import Controller from "../controller.abstract";
import CRUDController from "../crudController.interface";
import MatchingRequestProducer from "../../events/producers/matchingRequest/producer";

class MatchingRequestController extends Controller implements CRUDController {
  constructor(
    private readonly service: MatchingRequestService,
    private readonly parser: MatchingRequestParser,
    private readonly eventProducer: MatchingRequestProducer,
  ) {
    super();
  }

  public create = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingRequestController.handleValidationError(res, errors);
    }

    let parsedMatchingRequest, matchingRequest;
    try {
      parsedMatchingRequest = this.parser.parseCreateInput(req.body);
    } catch (parserError: any) {
      return MatchingRequestController.handleBadRequest(
        res,
        parserError.message,
      );
    }

    try {
      matchingRequest = await this.service.create(parsedMatchingRequest);
      if (!matchingRequest) {
        return MatchingRequestController.handleError(
          res,
          "Service did not return matching request after create",
        );
      }
      await this.eventProducer.create(matchingRequest);
      const matchingRequests = await this.service.findAll();
      console.log(
        "Match Request Created. NUMBER OF EASY MATCHING REQUEST: ",
        matchingRequests.filter(
          (x) => x.difficulty.toLowerCase() === "easy" && !x.success,
        ).length,
      );
      console.log(
        "Match Request Created. NUMBER OF MEDIUM MATCHING REQUEST: ",
        matchingRequests.filter(
          (x) => x.difficulty.toLowerCase() === "medium" && !x.success,
        ).length,
      );
      console.log(
        "Match Request Created. NUMBER OF HARD MATCHING REQUEST: ",
        matchingRequests.filter(
          (x) => x.difficulty.toLowerCase() === "hard" && !x.success,
        ).length,
      );
      return MatchingRequestController.handleSuccess(res, matchingRequest);
    } catch (serviceError: any) {
      if (serviceError instanceof Error) {
        return MatchingRequestController.handleError(res, serviceError.message);
      }
      return MatchingRequestController.handleError(
        res,
        "Unknown Service Error: Matching Request Create",
      );
    }
  };

  public findById = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingRequestController.handleValidationError(res, errors);
    }

    let parsedId, matchingRequest;
    try {
      parsedId = this.parser.parseFindByIdInput(req.params.id);
    } catch (parserError: any) {
      return MatchingRequestController.handleBadRequest(
        res,
        parserError.message,
      );
    }

    try {
      matchingRequest = await this.service.findById(parsedId);
    } catch (serviceError: any) {
      if (serviceError instanceof Error) {
        return MatchingRequestController.handleError(res, serviceError.message);
      }
      return MatchingRequestController.handleError(
        res,
        "Unknown Service Error: Matching Request Find By Id",
      );
    }
    if (matchingRequest) {
      return MatchingRequestController.handleSuccess(res, matchingRequest);
    }

    return MatchingRequestController.handleNotFound(
      res,
      "Matching Request Was Not Found",
    );
  };

  public findOne = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingRequestController.handleValidationError(res, errors);
    }

    let parsedFindOneInput, matchingRequest;
    try {
      parsedFindOneInput = this.parser.parseFindOneInput(req.body);
    } catch (parserError: any) {
      return MatchingRequestController.handleBadRequest(
        res,
        parserError.message,
      );
    }

    try {
      matchingRequest = await this.service.findOne(parsedFindOneInput);
    } catch (serviceError: any) {
      if (serviceError instanceof Error) {
        return MatchingRequestController.handleError(res, serviceError.message);
      }
      return MatchingRequestController.handleError(
        res,
        "Unknown Service Error: Matching Request Find One",
      );
    }
    if (matchingRequest) {
      return MatchingRequestController.handleSuccess(res, matchingRequest);
    }

    return MatchingRequestController.handleNotFound(
      res,
      "Matching Request Was Not Found",
    );
  };

  public findAll = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingRequestController.handleValidationError(res, errors);
    }

    try {
      const matchingRequests = await this.service.findAll();
      return MatchingRequestController.handleSuccess(res, matchingRequests);
    } catch (serviceError: any) {
      if (serviceError instanceof Error) {
        return MatchingRequestController.handleError(res, serviceError.message);
      }
      return MatchingRequestController.handleError(
        res,
        "Unknown Service Error: Matching Request Find All",
      );
    }
  };

  public update = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingRequestController.handleValidationError(res, errors);
    }

    let parsedId, parsedUpdateInput, matchingRequest;
    try {
      parsedId = this.parser.parseFindByIdInput(req.params.id);
    } catch (parserError: any) {
      return MatchingRequestController.handleBadRequest(
        res,
        parserError.message,
      );
    }

    try {
      parsedUpdateInput = this.parser.parseUpdateInput(req.body);
    } catch (parserError: any) {
      return MatchingRequestController.handleBadRequest(
        res,
        parserError.message,
      );
    }

    try {
      matchingRequest = await this.service.update(parsedId, parsedUpdateInput);
      if (!matchingRequest) {
        return MatchingRequestController.handleError(
          res,
          "Service did not return matching request after update",
        );
      }
      await this.eventProducer.update(matchingRequest);
      return MatchingRequestController.handleSuccess(res, matchingRequest);
    } catch (serviceError: any) {
      if (serviceError instanceof Error) {
        return MatchingRequestController.handleError(res, serviceError.message);
      }
      return MatchingRequestController.handleError(
        res,
        "Unknown Service Error: Matching Request Update",
      );
    }
  };

  public delete = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingRequestController.handleValidationError(res, errors);
    }

    let parsedId, matchingRequest;
    try {
      parsedId = this.parser.parseFindByIdInput(req.params.id);
    } catch (parserError: any) {
      return MatchingRequestController.handleBadRequest(
        res,
        parserError.message,
      );
    }

    try {
      matchingRequest = await this.service.delete(parsedId);
      if (!matchingRequest) {
        return MatchingRequestController.handleError(
          res,
          "Service did not return matching request after delete",
        );
      }
      await this.eventProducer.delete(matchingRequest);
      return MatchingRequestController.handleSuccess(res, matchingRequest);
    } catch (serviceError: any) {
      if (serviceError instanceof Error) {
        return MatchingRequestController.handleError(res, serviceError.message);
      }
      return MatchingRequestController.handleError(
        res,
        "Unknown Service Error: Matching Request Delete",
      );
    }
  };
}

export default MatchingRequestController;
