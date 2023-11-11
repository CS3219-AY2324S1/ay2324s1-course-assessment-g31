export type Query<T> = {
  [K in keyof T]: {
    value: T[K];
    order: "asc" | "desc";
    sortBy: boolean;
  };
} & {
  limit: string;
  offset: string;
};
