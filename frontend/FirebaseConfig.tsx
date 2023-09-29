// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEg8IlnhlThvcMj2w019goVkvxM3hypus",
  authDomain: "ass3-loginregister.firebaseapp.com",
  projectId: "ass3-loginregister",
  storageBucket: "ass3-loginregister.appspot.com",
  messagingSenderId: "742023757054",
  appId: "1:742023757054:web:017356af4151b111a4b9af",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getAuth(app);
export default database;
