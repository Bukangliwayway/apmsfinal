import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useOverallEmployerType = () => {
  const axiosPrivate = useAxiosPrivate();
  const useEmploymentType = async () => {
    return await axiosPrivate.get("/analytics/overall/employer_type/");
  };
  return useQuery("overall-employment-type", useEmploymentType, {
    staleTime: Infinity,
  });
};

export default useOverallEmployerType;
