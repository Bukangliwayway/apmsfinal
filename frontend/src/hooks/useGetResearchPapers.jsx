import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useGetResearchPapers = () => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get("/profiles/research_papers/me");
  };
  return useQuery("research-papers", getData, {
    staleTime: Infinity,
  });
};

export default useGetResearchPapers;
