import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useGetAllFeeds = (offset, placing) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async (offset, placing) => {
    return await axiosPrivate.get(
      `/posts/fetch-post/${offset}/${placing}`
    );
  };
  return useQuery(
    ["fetch-all-posts", offset, placing],
    () => getData(offset, placing),
    {
      staleTime: Infinity,
    }
  );
};

export default useGetAllFeeds;
