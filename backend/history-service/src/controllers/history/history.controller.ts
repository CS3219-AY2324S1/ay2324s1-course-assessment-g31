import { Request, Response } from "express";
import HistoryParser from "../../parsers/history/history.parser";
import HistoryService from "../../services/history/history.service";
import Controller from "../controller.abstract";
import CRUDController from "../crudController.interface";
import { validationResult } from "express-validator";
import { HistoryUpdateDTO } from "../../interfaces/history/updateDTO";

class HistoryController extends Controller implements CRUDController {
  constructor(
    private readonly service: HistoryService,
    private readonly parser: HistoryParser
  ) {
    super();
  }

  public create = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return HistoryController.handleValidationError(res, errors);
    }
    try {
      const parsedHistory = this.parser.parseCreateInput(req.body);
      const history = await this.service.create(parsedHistory);
      return HistoryController.handleSuccess(res, history);
    } catch (e: any) {
      console.log(e.message);
      return HistoryController.handleBadRequest(res, e.message);
    }
  };

  public findById = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return HistoryController.handleValidationError(res, errors);
    }

    let parsedId: string;

    try {
      parsedId = this.parser.parseFindByIdInput(req.params.id);
    } catch (e: any) {
      return HistoryController.handleBadRequest(res, e.message);
    }

    try {
      const history = await this.service.findById(parsedId);
      return HistoryController.handleSuccess(res, history);
    } catch (e: any) {
      return HistoryController.handleError(res, e.message);
    }
  };

  public findOne = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return HistoryController.handleValidationError(res, errors);
    }

    try {
      const parseFindOneInput = this.parser.parseFindOneInput(req.body);
      const history = await this.service.findOne(parseFindOneInput);
      return HistoryController.handleSuccess(res, history);
    } catch (e: any) {
      return HistoryController.handleBadRequest(res, e.message);
    }
  };

  public findAll = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return HistoryController.handleValidationError(res, errors);
    }

    try {
      const parsedQuery = this.parser.parseFindAllInput(req.query);
      const histories = await this.service.findAll(parsedQuery);
      return HistoryController.handleSuccess(res, histories);
    } catch (e: any) {
      return HistoryController.handleBadRequest(res, e.message);
    }
  };

  public update = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return HistoryController.handleValidationError(res, errors);
    }

    let parsedId: string;
    let parsedUpdateInput: Partial<HistoryUpdateDTO>;

    try {
      parsedId = this.parser.parseFindByIdInput(req.params.id);
      parsedUpdateInput = this.parser.parseUpdateInput(req.body);
    } catch (e: any) {
      return HistoryController.handleBadRequest(res, e.message);
    }

    try {
      const history = await this.service.update(parsedId, parsedUpdateInput);
      return HistoryController.handleSuccess(res, history);
    } catch (e: any) {
      return HistoryController.handleError(res, e.message);
    }
  };

  public delete = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return HistoryController.handleValidationError(res, errors);
    }

    try {
      const parsedId = this.parser.parseFindByIdInput(req.params.id);
      const history = await this.service.delete(parsedId);
      return HistoryController.handleSuccess(res, history);
    } catch (e: any) {
      return HistoryController.handleBadRequest(res, e.message);
    }
  };
}

export default HistoryController;
