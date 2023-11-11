import { DataRecord } from "../controllers/controller.abstract";
import { Query } from "../interfaces/query";

type ObjWithId = {
  id: unknown;
};

interface Service<CreateDTO, UpdateDTO, Obj extends ObjWithId> {
  create(body: CreateDTO): Promise<DataRecord<Obj>>;
  findById(id: Obj["id"]): Promise<DataRecord<Obj | null>>;
  findOne(body: Partial<Obj>): Promise<DataRecord<Obj | null>>;
  findAll(query: Query<Obj>): Promise<DataRecord<Obj[]>>;
  update(id: Obj["id"], body: Partial<UpdateDTO>): Promise<DataRecord<Obj>>;
  delete(id: Obj["id"]): Promise<DataRecord<Obj>>;
}

export default Service;
