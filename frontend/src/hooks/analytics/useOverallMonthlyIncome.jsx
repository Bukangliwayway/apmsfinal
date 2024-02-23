import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";
import dayjs from "dayjs";

const useOverallMonthlyIncome = (
  enabled,
  course_code,
  batch_year,
  date_start,
  date_end
) => {
  const dateEndFormatted = dayjs(date_end).format("YYYY-MM-DD");
  const dateStartFormatted = dayjs(date_start).format("YYYY-MM-DD");
  const axiosPrivate = useAxiosPrivate();
  const useMonthlyIncome = async () => {
    return await axiosPrivate.get(
      `/analytics/overall/monthly_income/?batch_year=${batch_year}&course_code=${course_code}&date_start=${dateStartFormatted}&date_end=${dateEndFormatted}`
    );
  };
  return useQuery(
    ["overall-monthly-income", batch_year, course_code, date_start, date_end],
    useMonthlyIncome,
    {
      staleTime: Infinity,
      enabled:
        enabled && !!batch_year && !!course_code && !!date_start && !!date_end,
    }
  );
};

export default useOverallMonthlyIncome;
