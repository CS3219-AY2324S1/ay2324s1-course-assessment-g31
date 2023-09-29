import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { User } from "@firebase/auth";
import QuestionsPage from "../pages/QuestionsPage/QuestionsPage";
// import RegisterPage from "./pages/RegisterPage/RegisterPage";
// import LoginPage from "./pages/LoginPage/LoginPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import Layout from "../pages/Layout/Layout";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import PageNotFoundPage from "../pages/PageNotFoundPage/PageNotFoundPage";

import { useAuth } from "../context/AuthContext";

export interface ProtectedRouteProp {
  user: User | null;
  children: React.ReactNode;
}

function ProtectedRoute({ user, children }: ProtectedRouteProp) {
  console.log(user);
  console.log("I have entered protected route");
  if (!user || Object.keys(user).length === 0) {
    // console.log(user);
    return <Navigate to="/" replace />;
  }
  return children;
}

function PostLoginNoAccessRoute({ user, children }: ProtectedRouteProp) {
  console.log(user);
  console.log("I have entered postlogin route");
  if (user) {
    console.log(user);
    return <Navigate to="/questions" replace />;
  }
  return children;
}

export default function RouterCompon() {
  const { currentUser } = useAuth();

  // const ProtectedRoute = ({ user, children }: ProtectedRouteProp) => {
  //   console.log(user);
  //   console.log("I have entered protected route");
  //   if (!user || Object.keys(user).length === 0) {
  //     // console.log(user);
  //     return <Navigate to="/" replace />;
  //   }
  //   return children;
  // };

  // const PostLoginNoAccessRoute = ({ user, children }: ProtectedRouteProp) => {
  //   console.log(user);
  //   console.log("I have entered postlogin route");
  //   if (user) {
  //     console.log(user);
  //     return <Navigate to="/questions" replace />;
  //   }
  //   return children;
  // };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* <Route path="/" element={<LoginPage />} /> */}
        {/* <Route path="/register" element={<RegisterPage />} /> */}

        <Route
          path="/"
          element={
            <PostLoginNoAccessRoute user={currentUser}>
              <LoginPage />
            </PostLoginNoAccessRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PostLoginNoAccessRoute user={currentUser}>
              <RegisterPage />
            </PostLoginNoAccessRoute>
          }
        />
        <Route
          path="/questions"
          element={
            <ProtectedRoute user={currentUser}>
              <QuestionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/profile"
          element={
            <ProtectedRoute user={currentUser}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<PageNotFoundPage />} />
      </Route>
    </Routes>
  );
}
