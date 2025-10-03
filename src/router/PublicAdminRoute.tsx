import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { JSX } from "react";

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicAdminRoute = ({ children }: PublicRouteProps) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (admin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default PublicAdminRoute;
