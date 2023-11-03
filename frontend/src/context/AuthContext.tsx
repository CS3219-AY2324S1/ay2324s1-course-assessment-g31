import React, { useContext, useState, useEffect, useMemo } from "react";
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

interface AuthContextType {
  currentUser: User | null;
  currentRole: string | null;
  login: (email: string, password: string) => Promise<UserCredential | void>;
  signup: (email: string, password: string) => Promise<UserCredential | void>;
  logout: () => Promise<void>;
  updateThePassword: (password: string) => Promise<void | Error>;
  verifyBeforeTheEmailUpdate: (email: string) => Promise<void | Error>;
  deleteTheUser: () => Promise<void | Error>;
}

const AuthContext = React.createContext<AuthContextType>({
  currentUser: {} as User | null,
  currentRole: {} as string | null,
  login: () => Promise.resolve(),
  signup: () => Promise.resolve(),
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
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(database, email, password);
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(database, email, password);
  }

  function logout() {
    return signOut(database);
  }

  function deleteTheUser() {
    if (currentUser) {
      return deleteUser(currentUser);
    }
    return Promise.resolve(new Error("Current user is not defined"));
  }

  function updateThePassword(password: string) {
    if (currentUser) {
      return updatePassword(currentUser, password);
    }
    return Promise.resolve(new Error("Current user is not defined"));
  }

  function verifyBeforeTheEmailUpdate(email: string) {
    if (currentUser) {
      return verifyBeforeUpdateEmail(currentUser, email);
    }
    return Promise.resolve(new Error("Current user is not defined"));
  }

  async function getUserRole(user: User): Promise<string> {
    try {
      const response = await fetch(
        `http://localhost:3000/user-services/userRole/${user.uid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch role:", data.message);
        return "User";
      }
      console.log("Successfully fetched role: ", data.user_role);
      return data.user_role;
    } catch (error: any) {
      console.log("Error fetching profile data:", error.message);
      return "User";
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(database, async (user) => {
      if (user) {
        setCurrentUser(user);
        const role = await getUserRole(user);
        setCurrentRole(role);
      } else {
        setCurrentUser(null);
        setCurrentRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo(() => {
    return {
      currentUser,
      currentRole,
      login,
      signup,
      logout,
      updateThePassword,
      deleteTheUser,
      verifyBeforeTheEmailUpdate,
    };
  }, [
    currentUser,
    currentRole,
    login,
    signup,
    logout,
    updateThePassword,
    deleteTheUser,
    verifyBeforeTheEmailUpdate,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingPage /> : children}
    </AuthContext.Provider>
  );
}
