import express from "express";
import { checkSchema } from "express-validator";
import QuestionController from "../../controllers/question/question.controller";
import createQuestionSchema from "../../util/validation/question/createQuestion.schema";
import BaseRouter from "../router.abstract";

class QuestionRouter extends BaseRouter<QuestionController> {
  override registerRoutes(): express.Router {
    this.router.route("/healthCheck").get(this.controller.healthCheck);

    this.router
      .route("/:id")
      .get(this.controller.findById)
      .put(this.controller.update)
      .delete(this.controller.delete);

    this.router
      .route("/")
      .get(this.controller.findAll)
      .post(checkSchema(createQuestionSchema), this.controller.create);

    return this.router;
  }
}

export default QuestionRouter;
