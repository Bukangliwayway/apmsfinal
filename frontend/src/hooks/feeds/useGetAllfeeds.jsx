import useAxiosPrivate from "../useAxiosPrivate";
import { useInfiniteQuery } from "react-query";

const useGetAllFeeds = (type) => {
  const axiosPrivate = useAxiosPrivate();
  const fetchFeeds = async ({ pageParam = { offset: 0 } }) => {
    const { data } = await axiosPrivate.get(
      `/posts/fetch-post/${pageParam.offset}/${type}`
    );
    return data;
  };

  return useInfiniteQuery(["fetch-all-posts", type], fetchFeeds, {
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.errorStatus === 404 || lastPage?.feeds?.length === 0) {
        return undefined;
      }
      if (lastPage && lastPage?.feeds?.length > 0) {
        const nextOffset = allPages.length * 10; // Assuming each page has 10 feeds
        return { offset: nextOffset };
      }
      return undefined;
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
