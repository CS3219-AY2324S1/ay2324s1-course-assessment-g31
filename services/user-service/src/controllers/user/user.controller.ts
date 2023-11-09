import { Request, Response } from "express";
import { validationResult } from "express-validator";

import UserProducer from "../../events/producers/user/producer";
import { UserCreateDTO } from "../../interfaces/user/createDTO";
import { User } from "../../interfaces/user/object";
import { UserUpdateDTO } from "../../interfaces/user/updateDTO";
import UserParser from "../../parsers/user/user.parser";
import UserService from "../../services/user/user.service";
import logger from "../../util/logger";
import Controller from "../controller.abstract";
import CRUDController from "../crudController.interface";
import { InternalRequest } from "express-validator/src/base";

class UserController extends Controller implements CRUDController {
  constructor(
    private readonly service: UserService,
    private readonly parser: UserParser,
    private readonly eventProducer: UserProducer,
  ) {
    super();
  }

  public create = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return UserController.handleValidationError(res, errors);
    }
    try {
      const parsedUser = this.parser.parseCreateInput(req.body);
      const user = await this.service.create(parsedUser);
      if (user) {
        this.eventProducer.create(user);
      }
      return UserController.handleSuccess(res, user);
    } catch (e: any) {
      return UserController.handleBadRequest(res, e.message);
    }
  };

  public findById = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return UserController.handleValidationError(res, errors);
    }

    let parsedId: string;

    try {
      parsedId = this.parser.parseFindByIdInput(req.params.id);
    } catch (e: any) {
      return UserController.handleBadRequest(res, e.message);
    }

    logger.info(`Finding user with id: ${parsedId}`);

    let userFromDb: User | null;

    try {
      userFromDb = await this.service.findById(parsedId);
    } catch (e: any) {
      return UserController.handleError(res, e.message);
    }

    if (!userFromDb) {
      const newUserCreateDTO: UserCreateDTO = {
        id: parsedId,
        name: "",
        roles: ["user"],
      };

      logger.info(`Creating user with id: ${parsedId}`);

      let newUser: User;
      try {
        newUser = await this.service.create(newUserCreateDTO);
      } catch (e: any) {
        return UserController.handleError(res, e.message);
      }

      logger.info(`Created user with id: ${parsedId}`);

      return UserController.handleSuccess(res, newUser);
    }

    logger.info(`Found user with id: ${parsedId}`);

    return UserController.handleSuccess(res, userFromDb);
  };

  public findOne = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return UserController.handleValidationError(res, errors);
    }

    try {
      const parsedFindOneInput = this.parser.parseFindOneInput(req.body);
      const user = await this.service.findOne(parsedFindOneInput);
      return UserController.handleSuccess(res, user);
    } catch (e: any) {
      return UserController.handleBadRequest(res, e.message);
    }
  };

  public findAll = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return UserController.handleValidationError(res, errors);
    }

    try {
      const users = await this.service.findAll();
      return UserController.handleSuccess(res, users);
    } catch (e: any) {
      return UserController.handleBadRequest(res, e.message);
    }
  };

  public update = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return UserController.handleValidationError(res, errors);
    }

    let parsedId: string;

    try {
      parsedId = this.parser.parseFindByIdInput(req.params.id);
    } catch (e: any) {
      return UserController.handleBadRequest(res, e.message);
    }

    let parsedUpdateInput: Partial<UserUpdateDTO>;

    try {
      parsedUpdateInput = this.parser.parseUpdateInput(req.body);
    } catch (e: any) {
      return UserController.handleBadRequest(res, e.message);
    }

    try {
      const user = await this.service.update(parsedId, parsedUpdateInput);
      if (user) {
        this.eventProducer.update(user);
      }
      return UserController.handleSuccess(res, user);
    } catch (e: any) {
      return UserController.handleError(res, e.message);
    }
  };

  public delete = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return UserController.handleValidationError(res, errors);
    }

    try {
      const parsedId = this.parser.parseFindByIdInput(req.params.id);
      const user = await this.service.delete(parsedId);
      if (user) {
        this.eventProducer.delete(user);
      }
      return UserController.handleSuccess(res, user);
    } catch (e: any) {
      return UserController.handleBadRequest(res, e.message);
    }
  };
}

export default UserController;
