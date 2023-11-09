import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { Question } from "../../interfaces/question/object";
import { QuestionUpdateDTO } from "../../interfaces/question/updateDTO";
import QuestionParser from "../../parsers/question/question.parser";
import QuestionService from "../../services/question/question.service";
import logger from "../../util/logger";

import Controller from "../controller.abstract";
import CRUDController from "../crudController.interface";
import QuestionProducer from "../../events/producers/question/producer";

class QuestionController extends Controller implements CRUDController {
  constructor(
    private readonly service: QuestionService,
    private readonly parser: QuestionParser,
    private readonly eventProducer: QuestionProducer,
  ) {
    super();
  }

  public create = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return QuestionController.handleValidationError(res, errors);
    }
    try {
      const parsedQuestion = this.parser.parseCreateInput(req.body);
      const question = await this.service.create(parsedQuestion);
      if (question) {
        this.eventProducer.create(question);
      }
      return QuestionController.handleSuccess(res, question);
    } catch (e: any) {
      return QuestionController.handleBadRequest(res, e.message);
    }
  };

  public findById = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return QuestionController.handleValidationError(res, errors);
    }

    let parsedId: number;

    try {
      parsedId = this.parser.parseFindByIdInput(req.params.id);
    } catch (e: any) {
      return QuestionController.handleBadRequest(res, e.message);
    }

    let questionFromDb: Question | null;

    try {
      questionFromDb = await this.service.findById(parsedId);
    } catch (e: any) {
      return QuestionController.handleError(res, e.message);
    }

    return QuestionController.handleSuccess(res, questionFromDb);
  };

  public findOne = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return QuestionController.handleValidationError(res, errors);
    }

    try {
      const parsedFindOneInput = this.parser.parseFindOneInput(req.body);
      const question = await this.service.findOne(parsedFindOneInput);
      return QuestionController.handleSuccess(res, question);
    } catch (e: any) {
      return QuestionController.handleBadRequest(res, e.message);
    }
  };

  public findAll = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return QuestionController.handleValidationError(res, errors);
    }

    try {
      const questions = await this.service.findAll();
      return QuestionController.handleSuccess(res, questions);
    } catch (e: any) {
      return QuestionController.handleBadRequest(res, e.message);
    }
  };

  public update = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return QuestionController.handleValidationError(res, errors);
    }

    let parsedId: number;

    try {
      parsedId = this.parser.parseFindByIdInput(req.params.id);
    } catch (e: any) {
      return QuestionController.handleBadRequest(res, e.message);
    }

    let parsedUpdateInput: Partial<QuestionUpdateDTO>;

    try {
      parsedUpdateInput = this.parser.parseUpdateInput(req.body);
    } catch (e: any) {
      return QuestionController.handleBadRequest(res, e.message);
    }

    try {
      const question = await this.service.update(parsedId, parsedUpdateInput);
      if (question) {
        this.eventProducer.update(question);
      }
      return QuestionController.handleSuccess(res, question);
    } catch (e: any) {
      return QuestionController.handleError(res, e.message);
    }
  };

  public delete = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return QuestionController.handleValidationError(res, errors);
    }

    try {
      const parsedId = this.parser.parseFindByIdInput(req.params.id);
      const question = await this.service.delete(parsedId);
      if (question) {
        this.eventProducer.delete(question);
      }
      return QuestionController.handleSuccess(res, question);
    } catch (e: any) {
      return QuestionController.handleBadRequest(res, e.message);
    }
  };
}

export default QuestionController;
