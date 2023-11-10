import { User } from "@firebase/auth";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import LandingPage from "../pages/LandingPage";
import Layout from "../pages/Layout/Layout";
import MatchingControlPanelPage from "../pages/MatchingControlPanelPage/MatchingControlPanelPage";
import MatchPage from "../pages/MatchingPage/MatchPage";
import PageNotFoundPage from "../pages/PageNotFoundPage/PageNotFoundPage";
import SingleQuestionPage from "../pages/SingleQuestionPage";
import RegistrationPage from "../pages/Users/RegistrationPage";
import SignInPage from "../pages/Users/SignInPage";

// import RegisterPage from "./pages/RegisterPage/RegisterPage";
// import LoginPage from "./pages/LoginPage/LoginPage";

interface RouterProps {
  user: User | null;
  children: React.ReactNode;
}

interface ProtectedRouteProp extends RouterProps {
  rolesNeeded: string[];
}

function ProtectedRoute({ user, rolesNeeded, children }: ProtectedRouteProp) {
  const { currentRole } = useAuth();

  if (!user || Object.keys(user).length === 0) {
    return <Navigate to="/" replace />;
  }

  if (
    !rolesNeeded.map((x) => x.toLowerCase()).includes(currentRole.toLowerCase())
  ) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}

function PostLoginNoAccessRoute({ user, children }: RouterProps) {
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
        <Route path="" element={<LandingPage />} />
        <Route
          path="sign-in"
          element={
            <PostLoginNoAccessRoute user={currentUser}>
              <SignInPage />
            </PostLoginNoAccessRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PostLoginNoAccessRoute user={currentUser}>
              <RegistrationPage />
            </PostLoginNoAccessRoute>
          }
        />

        <Route
          path="/match"
          element={
            <ProtectedRoute user={currentUser} rolesNeeded={["user"]}>
              <MatchPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/questions/:id"
          element={
            <ProtectedRoute user={currentUser} rolesNeeded={["user"]}>
              <SingleQuestionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matching/admin"
          element={
            <ProtectedRoute user={currentUser} rolesNeeded={["user"]}>
              <MatchingControlPanelPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<PageNotFoundPage />} />
      </Route>
    </Routes>
  );
}
