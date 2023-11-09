import express from "express";
import { checkSchema } from "express-validator";
import UserController from "../../controllers/user/user.controller";
import createUserSchema from "../../util/validation/user/createUser.schema";
import BaseRouter from "../router.abstract";

class UserRouter extends BaseRouter<UserController> {
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
      .post(checkSchema(createUserSchema), this.controller.create);

    return this.router;
  }
}

export default UserRouter;
