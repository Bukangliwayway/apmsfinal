import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useGetLikes = (postID) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async (postID) => {
    return await axiosPrivate.get(`/posts/likers/${postID}/`);
  };
  return useQuery(
    ["likers", postID],
    () => getData(postID),
    {
      staleTime: Infinity,
    }
  );
};

export default useGetLikes;
