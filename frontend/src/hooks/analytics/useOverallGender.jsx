import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useOverallGender = (enabled, course_code, batch_year) => {
  const axiosPrivate = useAxiosPrivate();
  const useGender = async () => {
    return await axiosPrivate.get(
      `/analytics/overall/gender/?batch_year=${batch_year}&course_code=${course_code}`
    );
  };
  return useQuery(["overall-gender", batch_year, course_code], useGender, {
    staleTime: Infinity,
    enabled: enabled && !!batch_year && !!course_code,
  });
};

export default useOverallGender;
