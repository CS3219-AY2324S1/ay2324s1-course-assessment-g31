import express from "express";
import { checkSchema } from "express-validator";
import MatchingRequestController from "../../controllers/matchingRequest/matchingRequest.controller";
import createMatchingRequestSchema from "../../util/validation/matchingRequest/createMatchingRequest.schema";
import { BaseRouter } from "../router.abstract";

class MatchingRequestRouter extends BaseRouter<MatchingRequestController> {
  override registerRoutes(): express.Router {
    this.router
      .route("/")
      .post(checkSchema(createMatchingRequestSchema), this.controller.create);

    this.router
      .route("/healthCheck")
      .get(this.controller.healthCheck);

    return this.router;
  }
}

export default MatchingRequestRouter;
