import { Request, Response } from "express";

type CRUDController = {
  create(req: Request, res: Response): any;
  findById(req: Request, res: Response): any;
  findOne(req: Request, res: Response): any;
  findAll(req: Request, res: Response): any;
  update(req: Request, res: Response): any;
  delete(req: Request, res: Response): any;
};

export default CRUDController;
