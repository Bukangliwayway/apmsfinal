import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useOverallEmploymentStatus = (enabled) => {
  const axiosPrivate = useAxiosPrivate();
  const useEmploymentStatus = async () => {
    return await axiosPrivate.get("/analytics/overall/employment_status/");
  };
  return useQuery("overall-employment-status", useEmploymentStatus, {
    staleTime: Infinity,
    enabled: enabled,
  });
};

export default useOverallEmploymentStatus;
