import { http } from "@/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useCommentMutation = (currentPage, postId) => {
  const queryClient = useQueryClient();
  const notify = (text) => toast(text);
  return useMutation({
    mutationFn: async (commentData) => {
      const res = await http.post(
        `api/comment/${postId}`,
        JSON.stringify(commentData)
      );
      if (res.status === 500 || res.status === 400)
        throw new Error("Erro ao salvar o seu comentário");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("post", postId);
      queryClient.invalidateQueries("posts", currentPage);
      notify("Comentário criado com sucesso!");
    },
    onError: (error, variables) => {
      notify("Não foi possível criar o comentário!");
      console.error(
        `Erro ao salvar o seu comentário para o slug: ${variables.slug}`,
        { error }
      );
    },
  });
};

export default useCommentMutation;
