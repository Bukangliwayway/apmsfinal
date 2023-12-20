import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useGetJobSpecific = (jobID) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async (jobID) => {
    return await axiosPrivate.get(`/selections/jobs/${jobID}`);
  };
  return useQuery(["job-specific", jobID], () => getData(jobID), {
    staleTime: Infinity,
  });
};

export default useGetJobSpecific;
