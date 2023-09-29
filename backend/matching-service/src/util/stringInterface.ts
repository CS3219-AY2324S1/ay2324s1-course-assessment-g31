// Converts all keys to be optional
export type StringInterface<T> = {
    [P in keyof T]: string;
  };
