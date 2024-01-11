import useAxiosPrivate from "../useAxiosPrivate";
import { useInfiniteQuery } from "react-query";

const useGetAllFeeds = () => {
  const axiosPrivate = useAxiosPrivate();
  const fetchFeeds = async ({ pageParam = { offset: 0, placing: 0 } }) => {
    const { data } = await axiosPrivate.get(
      `/posts/fetch-post/${pageParam.offset}`
    );
    return data;
  };

  return useInfiniteQuery(["fetch-all-posts"], fetchFeeds, {
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage.length > 0) {
        const nextPlacing = allPages.length;
        return { offset: nextPlacing * 10, placing: nextPlacing };
      }
      // If the last page is empty, there are no more pages to fetch
      return undefined;
    },
    staleTime: Infinity,
  });
};

export default useGetAllFeeds;
