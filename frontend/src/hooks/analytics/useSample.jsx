import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useSample = (code = "default_code", year = 0) => {
  const axiosPrivate = useAxiosPrivate();
  const useSalaryTrend = async () => {
    return await axiosPrivate.get(`/analytics/salary_trend/${code}/${year}`);
  };
  return useQuery("salary-trend", useSalaryTrend, {
    staleTime: Infinity,
  });
};

export default useSample;
