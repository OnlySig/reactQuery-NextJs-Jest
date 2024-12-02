/* eslint-disable no-undef */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react"; //<-method q testa APENAS os hooks da sua aplicação.
import useReplyMutation from "../useReplyMutation";
import React from "react";
import { http } from "@/http";

jest.mock("../../http", () => ({
  http: {
    post: jest.fn(),
  },
}));

describe("useReplyMutation", () => {
  let queryClient;
  let wrapper; //<-componente
  const commentData = { comment: { postId: 1 }, text: "Test reply" };
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    jest.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  it("deve chamar mutate e tratar o sucesso", async () => {
    http.post.mockResolvedValueOnce({
      data: { message: "Reply adicionado" },
      status: 200,
    });

    const { result } = renderHook(
      () => useReplyMutation("comment-ai", "test-slug"),
      {
        wrapper,
      }
    );
    result.current.mutate(commentData);
    await waitFor(() => result.current.isSuccess);
    console.log(result.current);
    expect(http.post).toHaveBeenCalledTimes(1);
    expect(http.post).toHaveBeenCalledWith(
      `api/comment/1/replies`,
      JSON.stringify(commentData)
    );
    expect(queryClient.getQueryData[("post", "test-slug")]).toBeUndefined();
  });

  it("deve tratar o erro", async () => {
    http.post.mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(
      () => useReplyMutation("comment-ai", "test-slug"),
      {
        wrapper,
      }
    );

    result.current.mutate(commentData);
    await waitFor(() => result.current.isError);

    expect(http.post).toHaveBeenCalledTimes(1);
    expect(result.current.error.message).toEqual("Network Error");
  });
});
