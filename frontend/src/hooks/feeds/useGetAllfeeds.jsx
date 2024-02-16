import useAxiosPrivate from "../useAxiosPrivate";
import { useInfiniteQuery } from "react-query";

const useGetAllFeeds = (type) => {
  const axiosPrivate = useAxiosPrivate();

  const fetchFeeds = async ({
    pageParam = { post_offset: 0, esis_offset: 0 },
  }) => {
    const { data } = await axiosPrivate.get(
      `/posts/fetch-post/${pageParam?.post_offset || 0}/${
        pageParam?.esis_offset || 0
      }/${type}`
    );
    return data;
  };

  return useInfiniteQuery(["fetch-all-posts", type], fetchFeeds, {
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.detail === "No Post to Show") return null;
      let postCount = 0;
      let esisCount = 0;

      allPages.map((page, index) => {
        page.map((instance) => {
          if (instance.is_esis) esisCount++;
          else postCount++;
        });
      });

      const nextOffset = {
        post_offset: postCount,
        esis_offset: esisCount,
      };
      return nextOffset;
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
