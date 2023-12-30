import { useContext } from "react";
import AllContext from "../../context/AllContext";

const useAll = () => {
  return useContext(AllContext);
};

export default useAll;
