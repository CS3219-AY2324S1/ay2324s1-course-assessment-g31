import { User } from "@firebase/auth";

type UserHocProps = {
  children: React.ReactNode;
  currentUser: User | null;
};

export default function UserHoc({ children, currentUser }: UserHocProps) {
  return currentUser ? children : null;
}
