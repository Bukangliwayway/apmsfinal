import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useOverallCivilStatus = (enabled) => {
  const axiosPrivate = useAxiosPrivate();
  const useCivilStatus = async () => {
    return await axiosPrivate.get("/analytics/overall/civil_status/");
  };
  return useQuery("overall-civil-status", useCivilStatus, {
    staleTime: Infinity,
    enabled: enabled
  });
};

export default useOverallCivilStatus;
