import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/FirebaseAuthContext";
import { NotificationContext } from "../context/NotificationContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  permissionRole: string;
}

function ProtectedRoute({ permissionRole, children }: ProtectedRouteProps) {
  const { addNotification } = useContext(NotificationContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      addNotification({
        type: "error",
        message: "Please Sign In to view this page",
      });
      navigate("/sign-in");
      return;
    }

    if (!currentUser.roles.includes(permissionRole)) {
      addNotification({
        type: "error",
        message: "You do not have access to view this page",
      });
      navigate("/sign-in");
    }
  }, [addNotification, navigate, permissionRole, currentUser]);

  return <div>{children}</div>;
}

export default ProtectedRoute;
