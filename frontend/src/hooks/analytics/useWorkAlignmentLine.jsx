import dayjs from "dayjs";
import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useWorkAlignmentLine = (course_code, batch_year, date_start, date_end) => {
  const dateEndFormatted = dayjs(date_end).format("YYYY-MM-DD");
  const dateStartFormatted = dayjs(date_start).format("YYYY-MM-DD");
  const axiosPrivate = useAxiosPrivate();
  const useWorkAlignmentLine = async () => {
    return await axiosPrivate.get(
      `/analytics/work_alignment/?batch_year=${batch_year}&course_code=${course_code}&date_start=${dateStartFormatted}&date_end=${dateEndFormatted}`
    );
  };

  return useQuery(
    ["work-alignment", batch_year, course_code, date_start, date_end],
    useWorkAlignmentLine,
    {
      staleTime: Infinity,
      enabled: !!batch_year && !!course_code && !!date_start && !!date_end,
    }
  );
};

export default useWorkAlignmentLine;
