import useAxiosPrivate from "../useAxiosPrivate";
import { useInfiniteQuery } from "react-query";

const useGetSearchProfiles = (name) => {
  const axiosPrivate = useAxiosPrivate();
  const fetchProfiles = async ({ pageParam = { offset: 0 } }) => {
    const { data } = await axiosPrivate.get(
      `/profiles/search/${name}/${pageParam.offset}`
    );
    return data;
  };

  return useInfiniteQuery(["fetch-search-profiles"], fetchProfiles, {
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

export default useGetSearchProfiles;
