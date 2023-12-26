import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useOverallResponseRate = () => {
  const axiosPrivate = useAxiosPrivate();
  const useResponseRate = async () => {
    return await axiosPrivate.get("/analytics/overall/response_rate/");
  };
  return useQuery("overall-response-rate", useResponseRate, {
    staleTime: Infinity,
  });
};

export default useOverallResponseRate;
