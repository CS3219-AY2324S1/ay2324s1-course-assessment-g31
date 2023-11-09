import { User as FirebaseUser } from "firebase/auth";

interface FullUser extends FirebaseUser, User {}

interface User {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  questionsAuthored: number;
  roles: string[];
}

interface UserCreateDTO {
  id: string;
  name: string;
  roles: string[];
}

interface UserUpdateDTO {
  name: string;
  roles: string[];
}

export type { User, FullUser, UserCreateDTO, UserUpdateDTO };
