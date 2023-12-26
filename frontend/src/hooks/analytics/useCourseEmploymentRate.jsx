import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useCourseEmploymentRate = () => {
  const axiosPrivate = useAxiosPrivate();
  const useCourse = async () => {
    return await axiosPrivate.get("/analytics/course_employment_rate/");
  };
  return useQuery("course-employment-rate", useCourse, {
    staleTime: Infinity,
  });
};

export default useCourseEmploymentRate;
