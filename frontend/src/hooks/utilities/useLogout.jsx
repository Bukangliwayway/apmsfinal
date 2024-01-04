import axios from "../../api/axios";
import useAll from "./useAll";
import { useQueryClient } from "react-query";
import { useNavigate, Link, useLocation } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    setAuth,
    setBackdropLoading,
    setMessage,
    setSeverity,
    setOpenSnackbar,
  } = useAll();
  const queryClient = useQueryClient(); // Get the queryClient instance

  const logout = async (message = "") => {
    const logoutMessage = message ? message : "Signed Out Successfully!";
    const alertMessage = message
      ? "Automatic logout detected. Please read the instruction above."
      : "Logged Out Successfully!";
    try {
      setBackdropLoading(true);
      queryClient.cancelQueries();
      await axios("/auth/logout", {
        withCredentials: true,
      });
      navigate("/login", {
        state: {
          from: location,
          message: logoutMessage,
        },
        replace: true,
      });
      setBackdropLoading(false);
      setMessage(alertMessage);
      setSeverity("success");
      setOpenSnackbar(true);
      queryClient.clear();
    } catch (err) {
      console.error(err);
    }
    setAuth({});
  };

  return logout;
};

export default useLogout;
