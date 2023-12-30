import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAll from "../hooks/utilities/useAll";

const PrivateRoutes = () => {
  const { auth } = useAll();
  const location = useLocation();
  const roles = ["public", "officer", "alumni", "admin"];
  return roles.includes(auth?.role) ? (
    <Outlet />
  ) : auth?.access_token ? (
    <Navigate to="/missing" state={{ from: location }} replace />
  ) : (
    <Navigate
      to="/login"
      state={{
        from: location,
      }}
      replace
    />
  );
};

export default PrivateRoutes;
