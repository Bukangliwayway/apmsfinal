import axios from "../../api/axios";
import useAuth from "./useAuth";
import { useQueryClient } from "react-query"; // Import useQueryClient
import { useNavigate, Link, useLocation } from "react-router-dom";


const useLogout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/home";
  const { setAuth } = useAuth();
  const queryClient = useQueryClient(); // Get the queryClient instance

  const logout = async () => {
    setAuth({});
    try {
      await axios("/auth/logout", {
        withCredentials: true,
      });
      queryClient.clear();
      navigate("/login", {
        state: {
          from: from,
          message: "Signed Out Successfully!",
        },
        replace: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
