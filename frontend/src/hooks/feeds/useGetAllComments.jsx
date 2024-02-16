import useAxiosPrivate from "../useAxiosPrivate";
import { useInfiniteQuery } from "react-query";

const useGetAllComments = (post_id) => {
  const axiosPrivate = useAxiosPrivate();

  const fetchComments = async ({ pageParam = { offset: 0 } }) => {
    const { offset } = pageParam;
    try {
      const { data } = await axiosPrivate.get(
        `/posts/fetch-comments/${offset || 0}/${post_id}`
      );
      return data;
    } catch (error) {
      throw error; // Rethrow the error for React Query to handle
    }
  };


  return useInfiniteQuery(["fetch-all-comments", post_id], fetchComments, {
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.detail === "You've Reached the End") {
        return null;
      }

      const lastItem = Array.isArray(lastPage)
        ? lastPage[lastPage.length - 1]
        : null;

      if (lastItem) {
        return {
          offset: allPages.reduce((acc, row) => acc + row.length, 0) || 0,
        };
      }

      return null;
    },
    staleTime: Infinity,
    retry: (failureCount, error) => {
      // Adjust the condition based on your specific error handling needs
      return !(error.response && error.response.status === 404);
    },
  });
};

export default useGetAllComments;
