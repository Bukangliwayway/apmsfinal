import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useOverallGender = () => {
  const axiosPrivate = useAxiosPrivate();
  const useGender = async () => {
    return await axiosPrivate.get("/analytics/overall/gender/");
  };
  return useQuery("overall-gender", useGender, {
    staleTime: Infinity,
  });
};

export default useOverallGender;
