import useAxiosPrivate from "../useAxiosPrivate";
import { useInfiniteQuery } from "react-query";

const useGetAllFeeds = (type) => {
  const axiosPrivate = useAxiosPrivate();

  const fetchFeeds = async ({
    pageParam = { post_offset: 0, esis_offset: 0 },
  }) => {
    const { data } = await axiosPrivate.get(
      `/posts/fetch-post/${pageParam.post_offset}/${pageParam.esis_offset}/${type}`
    );
    return data;
  };

  return useInfiniteQuery(["fetch-all-posts", type], fetchFeeds, {
    getNextPageParam: (lastPage, allPages) => {
      if (
        lastPage?.errorStatus === 200 &&
        lastPage?.detail === "No Post to Show"
      ) {
        return null; // Return null to stop fetching when no more posts
      }

      const lastItem = Array.isArray(lastPage)
        ? lastPage[lastPage.length - 1]
        : null;

      if (lastItem) {
        const postCount = lastItem.is_esis ? 0 : 1;
        const esisCount = lastItem.is_esis ? 1 : 0;
        const nextOffset = {
          post_offset: lastPage ? lastPage.post_offset + postCount : 0,
          esis_offset: lastPage ? lastPage.esis_offset + esisCount : 0,
        };
        return nextOffset;
      }

      return null; // Return null to stop fetching when no more posts
    },
    staleTime: Infinity,
    retry: (failureCount, error) => {
      if (error.response && error.response.status === 404) {
        return false;
      }
      return true;
    },
  });
};

export default useGetAllFeeds;
