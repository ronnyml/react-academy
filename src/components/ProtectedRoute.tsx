import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/useAuth";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("miau User:", user);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;