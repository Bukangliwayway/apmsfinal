import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useGetHistoryAll = () => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get("/uploads/history/all/");
  };
  return useQuery("history-all", getData, {
    staleTime: Infinity,
  });
};

export default useGetHistoryAll;
