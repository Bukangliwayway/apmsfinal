import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useWorkAlignmentOverTime = () => {
  const axiosPrivate = useAxiosPrivate();
  const useWorkAlignment = async () => {
    return await axiosPrivate.get("/analytics/work_alignment_over_time");
  };
  return useQuery("work-alignment-over-time", useWorkAlignment, {
    staleTime: Infinity,
  });
};

export default useWorkAlignmentOverTime;
