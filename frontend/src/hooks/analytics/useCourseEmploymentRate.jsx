import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useCourseEmploymentRate = (batch_year) => {
  const axiosPrivate = useAxiosPrivate();
  const useCourse = async (batch_year) => {
    return await axiosPrivate.get(
      `/analytics/course_employment_rate/${batch_year}`
    );
  };

  return useQuery(
    ["employment-rate", batch_year],
    () => useCourse(batch_year),
    {
      enabled: !!batch_year, // The query will not run if regionCode is not provided
      staleTime: Infinity,
    }
  );
};

export default useCourseEmploymentRate;
