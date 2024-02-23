import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useOverallResponseRate = (enabled) => {
  const axiosPrivate = useAxiosPrivate();
  const useResponseRate = async () => {
    return await axiosPrivate.get("/analytics/overall/response_rate/");
  };
  return useQuery("overall-response-rate", useResponseRate, {
    staleTime: Infinity,
    enabled: enabled,
  });
};

export default useOverallResponseRate;
