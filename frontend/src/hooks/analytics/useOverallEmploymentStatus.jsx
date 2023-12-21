import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useOverallEmploymentStatus = () => {
  const axiosPrivate = useAxiosPrivate();
  const useEmploymentStatus = async () => {
    return await axiosPrivate.get("/analytics/overall/employment_status");
  };
  return useQuery("overall-employment-status", useEmploymentStatus, {
    staleTime: Infinity,
  });
};

export default useOverallEmploymentStatus;
