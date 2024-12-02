import { http } from "@/http";
import { useQuery } from "@tanstack/react-query";
import { fetchPostsRating } from "./useFetchHome";
const fetchPage = async (slug) => {
  const { data } = await http(`api/post/${slug}`);
  return data;
};
const useFetchPostPage = (slug) => {
  const { data: post } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPage(slug),
    enabled: !!slug,
  });
  const { data: postRating } = useQuery({
    queryKey: ["postInfo", post?.id],
    queryFn: () => fetchPostsRating(post?.id),
    enabled: !!post?.id,
  });
  return {
    post,
    postRating,
  };
};

export default useFetchPostPage;
