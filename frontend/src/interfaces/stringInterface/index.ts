// Converts all keys to be string
export type StringInterface<T> = {
  [P in keyof T]: T[P] extends Array<infer U>
    ? Array<StringInterface<U>>
    : T[P] extends Date
    ? string
    : T[P] extends object
    ? StringInterface<T[P]>
    : string;
};
