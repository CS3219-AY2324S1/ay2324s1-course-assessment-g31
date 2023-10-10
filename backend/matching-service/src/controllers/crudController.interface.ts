import { RequestHandler } from "express";

type CRUDController = {
  create: RequestHandler;
  findById: RequestHandler;
  findOne: RequestHandler;
  findAll: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
};

export default CRUDController;
