import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  updatePassword,
  deleteUser,
  verifyBeforeUpdateEmail,
} from "@firebase/auth";
import database from "./FirebaseConfig";
import LoadingPage from "../pages/LoadingPage/LoadingPage";
import UserController from "../controllers/user/user.controller";

interface AuthContextType {
  currentUser: User | null;
  currentRole: string;
  login: (email: string, password: string) => Promise<UserCredential | void>;
  signUp: (email: string, password: string) => Promise<UserCredential | void>;
  logout: () => Promise<void>;
  updateThePassword: (password: string) => Promise<void | Error>;
  verifyBeforeTheEmailUpdate: (email: string) => Promise<void | Error>;
  deleteTheUser: () => Promise<void | Error>;
}

// ES removed unused variables
const AuthContext = React.createContext<AuthContextType>({
  currentUser: {} as User | null,
  currentRole: "user",
  login: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  updateThePassword: () => Promise.resolve(),
  verifyBeforeTheEmailUpdate: () => Promise.resolve(),
  deleteTheUser: () => Promise.resolve(),
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<string>("user");
  const userController = useMemo(() => new UserController(), []);

  const signUp = useCallback(
    (email: string, password: string) =>
      createUserWithEmailAndPassword(database, email, password),
    [],
  );

  const login = useCallback(
    (email: string, password: string) =>
      signInWithEmailAndPassword(database, email, password),
    [],
  );

  const logout = useCallback(() => signOut(database), []);

  const deleteTheUser = useCallback(() => {
    if (currentUser) {
      return deleteUser(currentUser);
    }
    return Promise.resolve(new Error("Current user is not defined"));
  }, [currentUser]);

  const updateThePassword = useCallback(
    (password: string) => {
      if (currentUser) {
        return updatePassword(currentUser, password);
      }
      return Promise.resolve(new Error("Current user is not defined"));
    },
    [currentUser],
  );

  const verifyBeforeTheEmailUpdate = useCallback(
    (email: string) => {
      if (currentUser) {
        return verifyBeforeUpdateEmail(currentUser, email);
      }
      return Promise.resolve(new Error("Current user is not defined"));
    },
    [currentUser],
  );

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser.uid);
    }
  }, [currentUser]);

  async function getUserRole(user: User): Promise<string> {
    try {
      // Check if firebase has this user
      if (user !== null) {
        const res = await userController.getUser(user.uid);
        if (!res || !res.data) {
          console.error("Failed to fetch role: ", res.statusText);
        } else {
          console.log("Successfully fetched role: ", res.data.roles.length);
          if (res.data.roles.length > 1) {
            return "admin";
          }
        }
      } else {
        console.log("Current user is not defined");
      }
      return "user";
    } catch (error: any) {
      console.log("Error fetching profile data:", error.message);
      return "user";
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(database, (user) => {
      if (user) {
        setCurrentUser(user);
        getUserRole(user).then((role) => {
          setCurrentRole(role);
        });
      } else {
        setCurrentUser(null);
        setCurrentRole("user");
      }
      setLoading(false);
    });
    return unsubscribe;
  });

  const value = useMemo(
    () => ({
      currentUser,
      currentRole,
      login,
      signUp,
      logout,
      updateThePassword,
      deleteTheUser,
      verifyBeforeTheEmailUpdate,
    }),
    [
      currentUser,
      currentRole,
      login,
      signUp,
      logout,
      updateThePassword,
      deleteTheUser,
      verifyBeforeTheEmailUpdate,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingPage /> : children}
    </AuthContext.Provider>
  );
}
