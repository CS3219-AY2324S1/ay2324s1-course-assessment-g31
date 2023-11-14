import express from "express";

import MatchingController from "../../controllers/matching/matching.controller";
import BaseRouter from "../router.abstract";

class MatchingRouter extends BaseRouter<MatchingController> {
  override registerRoutes(): express.Router {
    this.router.route("/healthCheck").get(this.controller.healthCheck);

    this.router
      .route("/:id")
      .get(this.controller.findById)
      .put(this.controller.update);

    this.router
      .route("/")
      .get(this.controller.findAll)
      .post(this.controller.create);

    return this.router;
  }
}

export default MatchingRouter;
