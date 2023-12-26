import { createContext, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

const ModeContext = createContext({});

export const ModeProvider = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export default ModeContext;
