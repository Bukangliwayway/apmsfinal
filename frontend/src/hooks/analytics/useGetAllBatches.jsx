import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useGetAllBatches = () => {
  const axiosPrivate = useAxiosPrivate();
  const useBatches = async () => {
    return await axiosPrivate.get("/analytics/all-batches");
  };
  return useQuery("all-batches", useBatches, {
    staleTime: Infinity,
  });
};

export default useGetAllBatches;
