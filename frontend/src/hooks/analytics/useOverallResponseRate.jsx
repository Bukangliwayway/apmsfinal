import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useOverallResponseRate = (enabled, course_code, batch_year) => {
  const axiosPrivate = useAxiosPrivate();
  const useResponseRate = async () => {
    return await axiosPrivate.get(
      `/analytics/overall/response_rate/?batch_year=${batch_year}&course_code=${course_code}`
    );
  };

  return useQuery(
    ["overall-response-rate", batch_year, course_code],
    useResponseRate,
    {
      staleTime: Infinity,
      enabled: enabled && !!batch_year && !!course_code,
    }
  );
};

export default useOverallResponseRate;
