// Converts all keys to be optional
export type OptionalInterface<T> = {
  [P in keyof T]?: T[P];
};
