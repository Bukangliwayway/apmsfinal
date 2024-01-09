import { useQuery } from "react-query";
import useAxiosPrivate from "../useAxiosPrivate";

const useGetSpecificFeed = (postID) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async (postID) => {
    return await axiosPrivate.get(`/posts/fetch-post/${postID}`);
  };
  return useQuery(
    ["post-specific", postID],
    () => getData(postID),
    {
      staleTime: Infinity,
    }
  );
};

export default useGetSpecificFeed;
