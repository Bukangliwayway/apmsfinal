import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useNationalCertificates = () => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get("/selections/national_certificates/");
  };
  return useQuery("national-certificates", getData, {
    staleTime: Infinity,
  });
};

export default useNationalCertificates;
