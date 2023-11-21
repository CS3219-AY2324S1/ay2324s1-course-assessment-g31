type ObjWithId = {
  id: unknown;
};

interface Service<CreateDTO, UpdateDTO, Obj extends ObjWithId> {
  create(body: CreateDTO): Promise<Obj>;
  findById(id: Obj["id"]): Promise<Obj | null>;
  findOne(body: Partial<Obj>): Promise<Obj | null>;
  findAll(): Promise<Obj[]>;
  update(id: Obj["id"], body: Partial<UpdateDTO>): Promise<Obj>;
  delete(id: Obj["id"]): Promise<Obj>;
}

export default Service;
