import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  NextOrObserver,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  deleteUser,
  User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBIcUU17g1xZeCta6MPArw34pVhgo72qpY",
  authDomain: "cs3219-c0869.firebaseapp.com",
  projectId: "cs3219-c0869",
  storageBucket: "cs3219-c0869.appspot.com",
  messagingSenderId: "643961371218",
  appId: "1:643961371218:web:7e32de3bbee5267a0c7d8b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const signInUser = async (email: string, password: string) => {
  if (!email && !password) throw new Error("No Email or Password");

  return signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (email: string, password: string) => {
  if (!email && !password) return {};

  return createUserWithEmailAndPassword(auth, email, password);
};

export const userStateListener = (callback: NextOrObserver<User>) =>
  onAuthStateChanged(auth, callback);

export const SignOutUser = async () => signOut(auth);

export const changePassword = async (user: User, newPassword: string) =>
  updatePassword(user, newPassword);

export const changeEmail = async (user: User, newEmail: string) =>
  updateEmail(user, newEmail);

export const removeUser = async (user: User) => deleteUser(user);
