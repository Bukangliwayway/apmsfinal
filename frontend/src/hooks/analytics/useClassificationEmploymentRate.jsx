import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useClassificationEmploymentRate = (batch_year, course_code) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get(
      `/analytics/classification_employment_rate/${batch_year}/${course_code}`
    )}
return useQuery(
    ["classification-employment", batch_year, course_code],
    () => getData(batch_year, course_code),
    {
      enabled: !!batch_year && !!course_code,

      staleTime: Infinity,
    }
  );
};

export default useClassificationEmploymentRate;
