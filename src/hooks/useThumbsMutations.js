import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/http";
import { toast } from "react-toastify";

export const useThumbsMutation = ({ slug, currentPage }) => {
  const queryClient = useQueryClient();
  const postQueryKey = ["post", slug];
  return useMutation({
    mutationFn: async (postData) => {
      const req = await http.post("api/thumbs", JSON.stringify(postData));
      if (req.status !== 201) {
        throw new Error(`HTTP error, status code: ${req.status} != de 201`);
      }
      return req;
    },
    onMutate: async () => {
      //<- atualização otimista via cache.
      await queryClient.cancelQueries(postQueryKey);
      const prevPost = queryClient.getQueryData(postQueryKey);
      if (prevPost) {
        queryClient.setQueryData(postQueryKey, {
          ...prevPost,
          likes: prevPost.likes + 1,
        });
      }
      return prevPost;
    },
    onSuccess: () => {
      currentPage && queryClient.invalidateQueries(["posts", currentPage]);
      toast("Like adicionado com sucesso!");
    },
    onError: (error, variables, context) => {
      toast(`Erro ao salvar o thumbUp para o slug: ${variables.slug}`);
      context && queryClient.setQueryData(postQueryKey, context);
      console.error(error);
    },
  });
};
