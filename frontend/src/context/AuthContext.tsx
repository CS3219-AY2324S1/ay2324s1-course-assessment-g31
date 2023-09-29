import React, { useContext, useState, useEffect } from "react";
import database from "../../FirebaseConfig";
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
} from "firebase/auth";
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

// ES removed unused variables
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

interface Props {
  children?: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState(null);

  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(database, email, password);
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(database, email, password);
  }

  function logout() {
    return signOut(database);
  }

  //   function resetPassword(email) {
  //     return auth.sendPasswordResetEmail(email);
  //   }

  //   function updateTheEmail(email: string) {
  //     //   return currentUser?.updateEmail(email);
  //     if (currentUser) {
  //       return updateEmail(currentUser, email);
  //     }
  //     return Promise.resolve(new Error("Current user is not defined"));
  //   }
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

  // function updateTheEmail(email: string) {
  //   if (currentUser) {
  //     return updateEmail(currentUser, email);
  //   }
  //   return Promise.resolve(new Error("Current user is not defined"));
  // }

  function verifyBeforeTheEmailUpdate(email: string) {
    if (currentUser) {
      return verifyBeforeUpdateEmail(currentUser, email);
    }
    return Promise.resolve(new Error("Current user is not defined"));
  }

  async function getUserRole(user: User) {
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
      } else {
        console.log("Successfully fetched role: ", data.user_role);
        return data.user_role;
      }
      // } else {
      //   console.log("Unauthenticated access");
      //   setMessage("Unauthenticated user access");
      // }
    } catch (error: any) {
      console.log("Error fetching profile data:", error.message);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(database, async (user) => {
      if (user) {
        setCurrentUser(user);
        await getUserRole(user).then((role) => {
          setCurrentRole(role);
        });
      } else {
        setCurrentUser(null);
        setCurrentRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    currentRole,
    login,
    signup,
    logout,
    updateThePassword,
    deleteTheUser,
    verifyBeforeTheEmailUpdate,
    //resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingPage /> : children}
    </AuthContext.Provider>
  );
}
