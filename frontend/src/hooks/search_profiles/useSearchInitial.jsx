import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useSearchInitial = () => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get(`/profiles/search/initial`);
  };
  return useQuery(["initial-profile"], () => getData(), {
    staleTime: Infinity,
  });
};

export default useSearchInitial;
