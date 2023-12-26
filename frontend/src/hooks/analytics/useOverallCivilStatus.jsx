import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useOverallCivilStatus = () => {
  const axiosPrivate = useAxiosPrivate();
  const useCivilStatus = async () => {
    return await axiosPrivate.get("/analytics/overall/civil_status/");
  };
  return useQuery("overall-civil-status", useCivilStatus, {
    staleTime: Infinity,
  });
};

export default useOverallCivilStatus;
