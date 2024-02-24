import dayjs from "dayjs";
import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useClassificationEmploymentRate = (
  batch_year,
  course_code,
  course_column,
  date_start,
  date_end,
) => {
  const dateStartFormatted = dayjs(date_start).format("YYYY-MM-DD");
  const dateEndFormatted = dayjs(date_end).format("YYYY-MM-DD");
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get(
      `/analytics/classification_employment_rate/?batch_year=${batch_year}&course_code=${course_code}&course_key=${course_column}&date_start=${dateStartFormatted}&date_end=${dateEndFormatted}`
    );
  };
  return useQuery(
    [
      "classification-employment",
      batch_year,
      course_code,
      course_column,
      date_start,
      date_end,
    ],
    () => getData(batch_year, course_code, course_column, date_start, date_end),
    {
      enabled: !!batch_year && !!course_code && !!date_start && !!date_end,
      staleTime: Infinity,
    }
  );
};

export default useClassificationEmploymentRate;
