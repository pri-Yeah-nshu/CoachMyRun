import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import Loader from "../pages/Loading";
import { Navigate } from "react-router-dom";

export default function ProtectedRoutes({ children }) {
  const authData = useContext(AuthContext);

  if (authData.loading) {
    return <Loader />;
  }

  if (!authData.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
