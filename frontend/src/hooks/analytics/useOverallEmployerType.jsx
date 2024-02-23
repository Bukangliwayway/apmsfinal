import dayjs from "dayjs";
import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useOverallEmployerType = (
  enabled,
  course_code,
  batch_year,
  date_start,
  date_end
) => {
  const dateEndFormatted = dayjs(date_end).format("YYYY-MM-DD");
  const dateStartFormatted = dayjs(date_start).format("YYYY-MM-DD");
  const axiosPrivate = useAxiosPrivate();
  const useEmploymentType = async () => {
    return await axiosPrivate.get(
      `/analytics/overall/employer_type/?batch_year=${batch_year}&course_code=${course_code}&date_start=${dateStartFormatted}&date_end=${dateEndFormatted}`
    );
  };
  return useQuery(
    ["overall-employment-type", batch_year, course_code, date_start, date_end],
    useEmploymentType,
    {
      staleTime: Infinity,
      enabled:
        enabled && !!batch_year && !!course_code && !!date_start && !!date_end,
    }
  );
};

export default useOverallEmployerType;
