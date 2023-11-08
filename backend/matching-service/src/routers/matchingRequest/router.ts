import express from "express";
import { checkSchema } from "express-validator";

import MatchingRequestController from "../../controllers/matchingRequest/matchingRequest.controller";
import createMatchingRequestSchema from "../../util/validation/matchingRequest/createMatchingRequest.schema";
import BaseRouter from "../router.abstract";

class MatchingRequestRouter extends BaseRouter<MatchingRequestController> {
  override registerRoutes(): express.Router {
    this.router.route("/healthCheck").get(this.controller.healthCheck);

    this.router.route("/cancel").post(this.controller.cancel);

    this.router
      .route("/:id")
      .get(this.controller.findById)
      .put(this.controller.update)
      .delete(this.controller.delete);

    this.router
      .route("/")
      .get(this.controller.findAll)
      .post(checkSchema(createMatchingRequestSchema), this.controller.create);

    return this.router;
  }
}

export default MatchingRequestRouter;
