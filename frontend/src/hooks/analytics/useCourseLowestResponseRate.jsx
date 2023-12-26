import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useCourseLowestResponseRate = () => {
  const axiosPrivate = useAxiosPrivate();
  const useCourse = async () => {
    return await axiosPrivate.get("/analytics/course_response_rate/recent_batch/");
  };
  return useQuery("course-response-rate-recent", useCourse, {
    staleTime: Infinity,
  });
};

export default useCourseLowestResponseRate;
