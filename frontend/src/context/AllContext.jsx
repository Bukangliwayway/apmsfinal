import { createContext, useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

const AllContext = createContext({});

export const AllProvider = ({ children }) => {
  const [expiredToken, setExpiredToken] = useState(false);
  const [toggleSideBar, setToggleSideBar] = useState(false);
  const [auth, setAuth] = useState({}); // for saving the user details
  const [message, setMessage] = useState(""); // for the alert message
  const [severity, setSeverity] = useState("error"); // for setting the severity of the alert
  const [cohort, setCohort] = useState({}); // for setting the severity of the alert
  const [openSnackbar, setOpenSnackbar] = useState(false); // for snackbar
  const [linearLoading, setLinearLoading] = useState(false); //for top linear loading
  const [backdropLoading, setBackdropLoading] = useState(false); //for backdrop loading
  const [persist, setPersist] = useState(
    localStorage.getItem("persist") == "true"
  );

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: light)");
  const [mode, setMode] = useState(prefersDarkMode ? "light" : "dark");

  return (
    <AllContext.Provider
      value={{
        auth,
        setAuth,
        toggleSideBar,
        setToggleSideBar,
        persist,
        setPersist,
        mode,
        setMode,
        message,
        setMessage,
        severity,
        setSeverity,
        openSnackbar,
        setOpenSnackbar,
        linearLoading,
        setLinearLoading,
        backdropLoading,
        setBackdropLoading,
        expiredToken,
        setExpiredToken,
        cohort,
        setCohort,
      }}
    >
      {children}
    </AllContext.Provider>
  );
};

export default AllContext;
