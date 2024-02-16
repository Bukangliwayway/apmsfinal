import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useGetCommentSpecific = (commentID) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async (commentID) => {
    return await axiosPrivate.get(`/posts/comment/${commentID}`);
  };
  return useQuery(["comment-specific", commentID], () => getData(commentID), {
    staleTime: Infinity,
  });
};

export default useGetCommentSpecific;
