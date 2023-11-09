import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import UserController from "../controllers/user/user.controller";
import { FullUser, User } from "../interfaces/User";
import { SignOutUser, userStateListener } from "../util/auth";
import { NotificationContext } from "./NotificationContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({
  // "User" comes from firebase auth-public.d.ts
  currentUser: {} as FullUser | null,
  setCurrentUser: (_user: FullUser) => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<FullUser | null>(null);
  const navigate = useNavigate();
  const ctrlInstance = useMemo(() => new UserController(), []);

  const { addNotification } = useContext(NotificationContext);

  // As soon as setting the current user to null,
  // the user will be redirected to the home page.
  const signOut = useCallback(async () => {
    await SignOutUser();
    setCurrentUser(null);
    navigate("/");
  }, [setCurrentUser, navigate]);

  useEffect(() => {
    const unsubscribe = userStateListener((user) => {
      if (user) {
        ctrlInstance
          .getUser(user.uid)
          .then((res) => {
            if (!res) {
              return;
            }

            const userFromDb: User = res.data;

            setCurrentUser({
              ...userFromDb,
              ...user,
            });
          })
          .catch((error: any) => {
            console.error("HIHIH", error);
          });
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, [setCurrentUser, ctrlInstance, addNotification, signOut]);

  const value = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      signOut,
    }),
    [currentUser, setCurrentUser, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
