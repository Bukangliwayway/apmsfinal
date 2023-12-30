import { Outlet, Navigate } from "react-router-dom";
import useAll from "../hooks/utilities/useAll";

const PublicRoutes = () => {
  const { auth } = useAll();
  return !auth?.access_token ? <Outlet /> : <Navigate to="/home" />;
};

export default PublicRoutes;
