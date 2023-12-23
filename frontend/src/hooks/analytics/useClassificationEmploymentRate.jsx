import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useClassificationEmploymentRate = () => {
  const axiosPrivate = useAxiosPrivate();
  const useCourse = async () => {
    return await axiosPrivate.get("/analytics/classification_employment_rate");
  };
  return useQuery("classification-employment-rate", useCourse, {
    staleTime: Infinity,
  });
};

export default useClassificationEmploymentRate;
