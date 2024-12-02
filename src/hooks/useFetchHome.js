import { http } from "@/http";
import { useQueries, useQuery } from "@tanstack/react-query";

const fetchPages = async (page) => {
  const { data } = await http.get(`api/posts?page=${page}`);
  return data;
};

export const fetchPostsRating = async (id) => {
  const { data } = await http.get(`api/post?postId=${id}`);
  return data;
};

const useFetchHome = (currentPage) => {
  const {
    data: posts,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPages(currentPage),
    staleTime: 4000,
  });
  const postsRatingQueries = useQueries({
    queries: posts?.data.length
      ? posts.data.map((post) => ({
          queryKey: ["postInfo", post.id],
          queryFn: () => fetchPostsRating(post.id),
          enabled: !!post.id,
        }))
      : [],
  }).reduce((acc, query) => {
    if (!query.isPending && query.data) {
      acc[query.data.id] = query.data;
    }
    return acc;
  }, {});

  return {
    posts,
    isLoading,
    isFetching,
    postsRatingQueries,
  };
};

export default useFetchHome;
