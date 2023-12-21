import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useOverallMonthlyIncome = () => {
  const axiosPrivate = useAxiosPrivate();
  const useMonthlyIncome = async () => {
    return await axiosPrivate.get("/analytics/overall/monthly_income");
  };
  return useQuery("overall-monthly-income", useMonthlyIncome, {
    staleTime: Infinity,
  });
};

export default useOverallMonthlyIncome;
