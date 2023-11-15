// Converts all keys to be string
export type StringInterface<T> = {
  [P in keyof T]: T[P] extends Array<any> ? string[] : string;
};
