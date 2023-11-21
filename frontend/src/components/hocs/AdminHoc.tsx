import { User } from "@firebase/auth";
import UserHoc from "./UserHoc";

type AdminHocProps = {
  children: React.ReactNode;
  currentUser: User | null;
  currentRole: string;
};

export default function AdminHoc({
  children,
  currentUser,
  currentRole,
}: AdminHocProps) {
  return (
    <UserHoc currentUser={currentUser}>
      {currentRole === "admin" ? children : null}
    </UserHoc>
  );
}
