import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useSalaryTrend = (
  course_code,
  batch_year,
) => {
  const axiosPrivate = useAxiosPrivate();
  const useSalaryTrend = async () => {
    return await axiosPrivate.get(
      `/analytics/salary_trend/${batch_year}/${course_code}`
    );
  };
  return useQuery(["salary-trend", batch_year, course_code], useSalaryTrend, {
    staleTime: Infinity,
    enabled: !!batch_year && !!course_code,
  });
};

export default useSalaryTrend;
