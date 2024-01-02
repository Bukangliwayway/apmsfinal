import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useCourseResponseRate = (batch_year) => {
  const axiosPrivate = useAxiosPrivate();
  const useCourse = async (batch_year) => {
    return await axiosPrivate.get(
      `/analytics/course_response_rate/${batch_year}`
    );
  };
  return (
    useQuery([("response-rate", batch_year)],
    () => useCourse(batch_year),
    {
      enabled: !!batch_year, // The query will not run if regionCode is not provided
      staleTime: Infinity,
    })
  );
};

export default useCourseResponseRate;
