import { Partial } from "../util/partial";
import { StringInterface } from "../util/stringInterface";

type ObjWithId = {
  id: unknown;
};

interface Parser<CreateDTO, UpdateDTO, Obj extends ObjWithId> {
  parseCreateInput(input: StringInterface<CreateDTO>): CreateDTO;
  parseFindByIdInput(id: string): Obj["id"];
  parseFindOneInput(input: Partial<StringInterface<Obj>>): Partial<Obj>;
  parseUpdateInput(
    input: Partial<StringInterface<UpdateDTO>>,
  ): Partial<UpdateDTO>;
  parseDeleteInput(id: string): Obj["id"];
}

export default Parser;
