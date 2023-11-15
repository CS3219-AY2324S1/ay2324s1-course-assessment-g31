import { User } from "@firebase/auth";
import UserHoc from "./UserHoc";

type InMatchingHocProps = {
  children: React.ReactNode;
  currentUser: User | null;
  matchingId: string;
};

export default function InMatchingHoc({
  children,
  currentUser,
  matchingId,
}: InMatchingHocProps) {
  return (
    <UserHoc currentUser={currentUser}>
      {matchingId !== "" ? children : null}
    </UserHoc>
  );
}
