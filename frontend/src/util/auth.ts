import { initializeApp } from "@firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  NextOrObserver,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "@firebase/auth";

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
  if (!email && !password) return;
  await signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (email: string, password: string) => {
  if (!email && !password) return;
  await createUserWithEmailAndPassword(auth, email, password);
};

export const userStateListener = (callback: NextOrObserver<User>) => {
  return onAuthStateChanged(auth, callback);
};

export const SignOutUser = async () => {
  await signOut(auth);
};
