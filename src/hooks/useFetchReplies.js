import { http } from "@/http";
import { useQuery } from "@tanstack/react-query";

export const fetchReplies = async (id, slug) => {
  const { data } = await http.get(`api/comment/${id}/replies?slug=${slug}`);
  return data;
};
const useFetchReplies = (id, slug) => {
  const { data, isLoading } = useQuery({
    queryKey: ["replies", id, slug],
    queryFn: () => fetchReplies(id, slug),
    enabled: !!id && !!slug,
    retry: 5,
    retryDelay: 100,
  });
  return {
    data,
    isLoading,
  };
};

export default useFetchReplies;
