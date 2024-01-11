import { useQuery } from "react-query";
import useAxiosPrivate from "../useAxiosPrivate";

const useGetSpecificFeed = (postID) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async (postID) => {
    return await axiosPrivate.get(`/posts/fetch-post/view/${postID}`);
  };
  return useQuery(
    ["post-specific", postID],
    () => getData(postID),
  );
};

export default useGetSpecificFeed;
