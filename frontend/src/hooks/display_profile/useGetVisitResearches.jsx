import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useGetVisitResearches = (username) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async (username) => {
    return await axiosPrivate.get(`/profiles/research_papers/${username}`);
  };
  return useQuery(["visit-research-papers", username], () => getData(username), {
    staleTime: Infinity,
  });
};

export default useGetVisitResearches;
