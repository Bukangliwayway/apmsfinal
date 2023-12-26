import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useEmploymentCountOverTime = () => {
  const axiosPrivate = useAxiosPrivate();
  const useEmploymenCount = async () => {
    return await axiosPrivate.get("/analytics/employment_count_over_time/");
  };
  return useQuery("employment-count-over-time", useEmploymenCount, {
    staleTime: Infinity,
  });
};

export default useEmploymentCountOverTime;
