import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useOverallCivilStatus = (enabled, course_code, batch_year) => {
  const axiosPrivate = useAxiosPrivate();
  const useCivilStatus = async () => {
    return await axiosPrivate.get(
      `/analytics/overall/civil_status/?batch_year=${batch_year}&course_code=${course_code}`
    );
  };
  return useQuery(
    ["overall-civil-status", batch_year, course_code],
    useCivilStatus,
    {
      staleTime: Infinity,
      enabled: enabled && !!batch_year && !!course_code,
    }
  );
};

export default useOverallCivilStatus;
