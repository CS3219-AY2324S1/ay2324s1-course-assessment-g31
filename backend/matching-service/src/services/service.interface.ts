import { OptionalInterface } from "../util/optionalInterface";

interface Service<CreateDTO, UpdateDTO, Object> {
  create(body: CreateDTO): Promise<Object>;
  findById(id: number): Promise<Object | null>;
  findOne(body: OptionalInterface<Object>): Promise<Object | null>;
  findAll(): Promise<Object[]>;
  update(id: number, body: UpdateDTO): Promise<Object>;
  delete(id: number): Promise<Object>;
}

export default Service;
