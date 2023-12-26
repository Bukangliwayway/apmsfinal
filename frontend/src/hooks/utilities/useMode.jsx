import { useContext } from "react";
import ModeContext from "../../context/ModeProvider";

const useMode = () => {
  return useContext(ModeContext);
};

export default useMode;
