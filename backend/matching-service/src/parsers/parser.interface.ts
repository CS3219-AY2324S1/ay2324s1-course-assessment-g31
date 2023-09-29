import { OptionalInterface } from "../util/optionalInterface";
import { StringInterface } from "../util/stringInterface";

export type Parser<CreateDTO, UpdateDTO,Object> = {
    parseCreateInput(input: StringInterface<CreateDTO>): CreateDTO;
    parseFindByIdInput(id: string | undefined): number;
    parseFindOneInput(input: OptionalInterface<StringInterface<Object>>): OptionalInterface<Object>;
    parseUpdateInput(input: StringInterface<UpdateDTO>): UpdateDTO;
    parseDeleteInput(id: string | undefined): number;
}