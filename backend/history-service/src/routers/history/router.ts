import express from "express";
import { checkSchema } from "express-validator";
import BaseRouter from "../router.abstract";
import HistoryController from "../../controllers/history/history.controller";
import createHistorySchema from "../../util/validation/history/createHistory.schema";

class HistoryRouter extends BaseRouter<HistoryController> {
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
      .post(checkSchema(createHistorySchema), this.controller.create);

    return this.router;
  }
}

export default HistoryRouter;
