import express from "express";
import Controller from "../controllers/controller.abstract";
import CRUDController from "../controllers/crudController.interface";

abstract class BaseRouter<ControllerType extends Controller & CRUDController> {
  constructor(
    protected readonly controller: ControllerType,
    protected readonly router: express.Router
  ) {}

  abstract registerRoutes(): express.Router;
}

export default BaseRouter;
