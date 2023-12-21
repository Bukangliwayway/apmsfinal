import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useOverallEmploymentContract = () => {
  const axiosPrivate = useAxiosPrivate();
  const useEmploymentContract = async () => {
    return await axiosPrivate.get("/analytics/overall/employment_contract");
  };
  return useQuery("overall-employment-contract", useEmploymentContract, {
    staleTime: Infinity,
  });
};

export default useOverallEmploymentContract;
