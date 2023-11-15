import { User } from "@firebase/auth";
import React, { useContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import ForbiddenPage from "../pages/ForbiddenPage/ForbiddenPage";
import LandingPage from "../pages/LandingPage";
import Layout from "../pages/Layout/Layout";
import MatchingControlPanelPage from "../pages/MatchingControlPanelPage/MatchingControlPanelPage";
import MatchPage from "../pages/MatchPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import QuestionForm from "../pages/QuestionForm/QuestionForm";
import AllQuestionPage from "../pages/Questions/AllQuestionsPage";
import SingleQuestionPage from "../pages/Questions/SingleQuestionPage";
import CreateSingleQuestionPage from "../pages/Questions/SingleQuestionPage/create";
import EditSingleQuestionPage from "../pages/Questions/SingleQuestionPage/edit";
import SolutionForm from "../pages/SolutionForm/SolutionForm";
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
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  if (!user || Object.keys(user).length === 0) {
    addNotification({
      type: "error",
      message: "Please Sign In to View this Page.",
    });
    navigate("/");
  }

  if (
    !rolesNeeded.map((x) => x.toLowerCase()).includes(currentRole.toLowerCase())
  ) {
    addNotification({
      type: "error",
      message: "You are unauthorized to view this page.",
    });
    navigate("/forbidden");
  }

  return children;
}

function PostLoginNoAccessRoute({ user, children }: RouterProps) {
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  if (user) {
    addNotification({
      type: "error",
      message: "You are not allowed to view this page after signing in.",
    });
    navigate("/questions");
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
          path="/questions/create"
          element={
            <ProtectedRoute user={currentUser} rolesNeeded={["admin"]}>
              <CreateSingleQuestionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/questions"
          element={
            <ProtectedRoute user={currentUser} rolesNeeded={["user"]}>
              <AllQuestionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="questions/:questionId/edit"
          element={
            <ProtectedRoute user={currentUser} rolesNeeded={["user"]}>
              <EditSingleQuestionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/questions/:questionId"
          element={
            <ProtectedRoute user={currentUser} rolesNeeded={["admin"]}>
              <SingleQuestionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/questions/form"
          element={
            <ProtectedRoute user={currentUser} rolesNeeded={["user"]}>
              <QuestionForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/questions/solution/form"
          element={
            <ProtectedRoute user={currentUser} rolesNeeded={["user"]}>
              <SolutionForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={currentUser} rolesNeeded={["user"]}>
              <ProfilePage />
            </ProtectedRoute>
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
            <ProtectedRoute user={currentUser} rolesNeeded={["admin"]}>
              <MatchingControlPanelPage />
            </ProtectedRoute>
          }
        />

        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
