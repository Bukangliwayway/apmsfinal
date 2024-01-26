import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useMissingFields = () => {
  const axiosPrivate = useAxiosPrivate();
  const getMissingFields = async () => {
    return await axiosPrivate.get("/profiles/is_complete_check/me");
  };
  return useQuery("missing-fields", getMissingFields, {
    staleTime: Infinity,
  });
};

export default useMissingFields;
