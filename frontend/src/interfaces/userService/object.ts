import { User as FirebaseUser } from "firebase/auth";

export type User = {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  questionsAuthored: number;
  roles: string[];
};

export type FullUser = FirebaseUser & User;
