import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useOverallEmploymentStatus = (enabled, course_code, batch_year) => {
  const axiosPrivate = useAxiosPrivate();
  const useEmploymentStatus = async () => {
    return await axiosPrivate.get(
      `/analytics/overall/employment_status/?batch_year=${batch_year}&course_code=${course_code}`
    );
  };
  return useQuery(
    ["overall-monthly-income", batch_year, course_code],
    useEmploymentStatus,
    {
      staleTime: Infinity,
      enabled: enabled && !!batch_year && !!course_code,
    }
  );
};

export default useOverallEmploymentStatus;
