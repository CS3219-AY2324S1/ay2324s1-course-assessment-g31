export type User = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  questionsAuthored: number;
  roles: string[];
};

export type OptionalUser = Partial<User>;
