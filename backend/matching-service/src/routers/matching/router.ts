import express from "express";
import { checkSchema } from "express-validator";
import MatchingController from "../../controllers/matching/matching.controller";
import createMatchingSchema from "../../util/validation/matching/createMatching.schema";
import { BaseRouter } from "../router.abstract";

class MatchingRouter extends BaseRouter<MatchingController> {
  override registerRoutes(): express.Router {
    this.router
      .route("/")
      .post(checkSchema(createMatchingSchema), this.controller.create);

    this.router.route("/healthCheck").get(this.controller.healthCheck);

    return this.router;
  }
}

export default MatchingRouter;
