import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useClassificationEmploymentRate = (
  batch_year,
  course_code,
  course_column
) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get(
      `/analytics/classification_employment_rate/${batch_year}/${course_code}/${course_column}`
    );
  };
  return useQuery(
    ["classification-employment", batch_year, course_code, course_column],
    () => getData(batch_year, course_code, course_column),
    {
      enabled: !!batch_year && !!course_code,
      staleTime: Infinity,
    }
  );
};

export default useClassificationEmploymentRate;
