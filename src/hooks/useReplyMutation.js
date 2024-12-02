import { http } from "@/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useReplyMutation = (commentId, slug, modalRef) => {
  const queryClient = useQueryClient();
  const notify = (text) => toast(text);
  const replyMutation = useMutation({
    mutationFn: async (commentData) => {
      const { data, status } = await http.post(
        `api/comment/${commentData.comment.postId}/replies`,
        JSON.stringify(commentData)
      );
      if (status === 400 || status === 500)
        throw new Error("Erro ao responder comentário");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["post", slug]);
      modalRef.current.closeModal();
      notify("Resposta enviada com sucesso!");
    },
    onError: (error, variables) => {
      modalRef.current.closeModal();
      console.error(error.message);
      notify(
        `Erro inesperado!, não foi possível responder o comentário de: ${variables.comment.author.name}`
      );
    },
  });

  return {
    mutate: ({ comment, text }) => replyMutation.mutate({ comment, text }),
    status: replyMutation.status,
    error: replyMutation.error,
    isError: replyMutation.isError,
    isSuccess: replyMutation.isSuccess,
  };
};

export default useReplyMutation;
