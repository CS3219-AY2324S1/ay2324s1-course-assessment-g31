import { Request, Response } from "express";
import { validationResult } from "express-validator";

import QuestionProducer from "../../events/producers/question/producer";
import { FullQuestion } from "../../interfaces/fullQuestion/object";
import { Query } from "../../interfaces/query";
import { QuestionUpdateDTO } from "../../interfaces/question/updateDTO";
import QuestionParser from "../../parsers/question/question.parser";
import QuestionService from "../../services/question/question.service";
import Controller from "../controller.abstract";
import CRUDController from "../crudController.interface";

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
        this.eventProducer.create(question.data);
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

    console.log("Parsed ID:", parsedId);

    try {
      const questionFromDb = await this.service.findById(parsedId);
      return QuestionController.handleSuccess(res, questionFromDb);
    } catch (e: any) {
      return QuestionController.handleError(res, e.message);
    }
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

    const query: Partial<Query<FullQuestion>> = req.query;

    try {
      const questions = await this.service.findAll(query);
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
        this.eventProducer.update(question.data);
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
        this.eventProducer.delete(question.data);
      }
      return QuestionController.handleSuccess(res, question);
    } catch (e: any) {
      return QuestionController.handleBadRequest(res, e.message);
    }
  };
}

export default QuestionController;
