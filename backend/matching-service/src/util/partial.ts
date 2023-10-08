// Converts all keys to be optional
export type Partial<T> = {
  [P in keyof T]?: T[P];
};
