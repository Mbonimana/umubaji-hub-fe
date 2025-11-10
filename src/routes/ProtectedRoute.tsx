import type { JSX } from "react";
import { Navigate } from "react-router-dom";


export default function ProtectedRoute({children, allowedRoles,}: {children: JSX.Element; allowedRoles?: string[];
}) {
  const token = localStorage.getItem("jwtToken");
  const userData = localStorage.getItem("user");

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userData);

  
  if (allowedRoles && !allowedRoles.includes(user.user_role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
