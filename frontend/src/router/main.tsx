import { User } from "@firebase/auth";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Layout from "../pages/Layout/Layout";
import LoginPage from "../pages/LoginPage/LoginPage";
import MatchPage from "../pages/MatchingPage/MatchPage";
import PageNotFoundPage from "../pages/PageNotFoundPage/PageNotFoundPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import QuestionsPage from "../pages/QuestionsPage/QuestionsPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import SingleQuestionPage from "../pages/SingleQuestionPage";

// import RegisterPage from "./pages/RegisterPage/RegisterPage";
// import LoginPage from "./pages/LoginPage/LoginPage";
export interface ProtectedRouteProp {
  user: User | null;
  children: React.ReactNode;
}

function ProtectedRoute({ user, children }: ProtectedRouteProp) {
  if (!user || Object.keys(user).length === 0) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function PostLoginNoAccessRoute({ user, children }: ProtectedRouteProp) {
  if (user) {
    return <Navigate to="/questions" replace />;
  }
  return children;
}

export default function MainRouter() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
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
          path="/profile"
          element={
            <ProtectedRoute user={currentUser}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/match"
          element={
            <ProtectedRoute user={currentUser}>
              <MatchPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/questions/:id"
          element={
            <ProtectedRoute user={currentUser}>
              <SingleQuestionPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<PageNotFoundPage />} />
      </Route>
    </Routes>
  );
}
