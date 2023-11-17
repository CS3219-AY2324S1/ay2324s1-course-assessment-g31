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
    try {
      const parsedMatchingRequest = this.parser.parseCreateInput(req.body);
      const matchingRequest = await this.service.create(parsedMatchingRequest);
      const matchingReqs = await this.service.findAll();
      console.log(
        "Match Request Created. NUMBER OF EASY MATCHING REQUEST: ",
        matchingReqs.filter(
          (x) => x.difficulty.toLowerCase() === "easy" && !x.success,
        ).length,
      );
      console.log(
        "Match Request Created. NUMBER OF MEDIUM MATCHING REQUEST: ",
        matchingReqs.filter(
          (x) => x.difficulty.toLowerCase() === "medium" && !x.success,
        ).length,
      );
      console.log(
        "Match Request Created. NUMBER OF HARD MATCHING REQUEST: ",
        matchingReqs.filter(
          (x) => x.difficulty.toLowerCase() === "hard" && !x.success,
        ).length,
      );
      if (matchingRequest) {
        await this.eventProducer.create(matchingRequest);
      }
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
      const parsedId = this.parser.parseFindByIdInput(req.params.id);
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
      const matchingRequests = await this.service.findAll();
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
      const parsedId = this.parser.parseFindByIdInput(req.params.id);
      const parsedUpdateInput = this.parser.parseUpdateInput(req.body);
      const matchingRequest = await this.service.update(
        parsedId,
        parsedUpdateInput,
      );
      if (matchingRequest) {
        await this.eventProducer.update(matchingRequest);
      }
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

    const parsedId = this.parser.parseFindByIdInput(req.params.id);

    try {
      const matchingRequestFromDb = await this.service.findById(parsedId);
      if (!matchingRequestFromDb) {
        return MatchingRequestController.handleNotFound(
          res,
          "Matching Request Not Found",
        );
      }
    } catch (e: any) {
      console.log(e);
      return MatchingRequestController.handleBadRequest(res, e.message);
    }

    try {
      const matchingRequest = await this.service.delete(parsedId);
      if (matchingRequest) {
        await this.eventProducer.delete(matchingRequest);
      }
      return MatchingRequestController.handleSuccess(res, matchingRequest);
    } catch (e: any) {
      console.log(e);
      return MatchingRequestController.handleBadRequest(res, e.message);
    }
  };

  public cancel = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return MatchingRequestController.handleValidationError(res, errors);
    }

    try {
      const parsedFindOneInput = this.parser.parseFindOneInput(req.body);
      const matchingRequest = await this.service.findOne(parsedFindOneInput);
      if (!matchingRequest)
        return MatchingRequestController.handleBadRequest(res, "Not Found");
      const cancelledMatchingRequest = await this.service.delete(
        matchingRequest.id,
      );
      return MatchingRequestController.handleSuccess(
        res,
        cancelledMatchingRequest,
      );
    } catch (e: any) {
      return MatchingRequestController.handleBadRequest(res, e.message);
    }
  };
}

export default MatchingRequestController;
