import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useGetEmploymentStatus = () => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get("/profiles/employment_status/");
  };
  return useQuery("employment-status", getData, {
    staleTime: Infinity,
  });
};

export default useGetEmploymentStatus;
