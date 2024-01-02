import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useRespondents = (batch_year, course_code) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async (batch_year, course_code) => {
    return await axiosPrivate.get(
      `/analytics/respondents-list/${batch_year}/${course_code}`
    );
  };
  return useQuery(
    ["respondents-list - ", batch_year, " - ", course_code],
    () => getData(batch_year, course_code),
    {
      enabled: !!batch_year && !!course_code,

      staleTime: Infinity,
    }
  );
};

export default useRespondents;
