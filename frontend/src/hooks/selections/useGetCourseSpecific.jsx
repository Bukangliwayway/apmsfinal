import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useGetCourseSpecific = (courseID) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async (courseID) => {
    return await axiosPrivate.get(`/selections/courses/${courseID}`);
  };
  return useQuery(["course-specific", courseID], () => getData(courseID), {
    staleTime: Infinity,
  });
};

export default useGetCourseSpecific;