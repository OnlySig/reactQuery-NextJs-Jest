/* eslint-disable react/prop-types */
"use client";

import React, { useState } from "react";
import styles from "./replies.module.css";
import { Comment } from "../Comment";
import { ReplyModal } from "../ModalReply";
import useFetchReplies, { fetchReplies } from "@/hooks/useFetchReplies";
import { Spinner } from "../Spinner";
import { useQueryClient } from "@tanstack/react-query";

export const Replies = ({ comment, slug }) => {
  const queryClient = useQueryClient();
  const [showReplies, setShowReplies] = useState(false);
  const { data: replies, isLoading } = useFetchReplies(showReplies && comment.id, slug)
  let timeoutId
  const prefetch = () => {
    if (!showReplies) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        queryClient.prefetchQuery({
          queryKey: ["replies", comment.id, slug],
          queryFn: () => fetchReplies(comment.id, slug),
          retry: 5,
          retryDelay: 1000,
        })
      }, 400)
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.replies}>
        <button
          className={styles.btn}
          onClick={() => setShowReplies(!showReplies)}
          onMouseOver={prefetch}
        >
          {showReplies ? "Ocultar" : "Ver"} respostas
        </button>
        {
          isLoading ? <Spinner /> :
            showReplies && replies?.length && (
              <ul>
                {replies.map((reply) => (
                  <li key={reply.id}>
                    <Comment comment={reply} />
                    <ReplyModal comment={reply} />
                  </li>
                ))}
              </ul>
            )}
      </div>
    </div>
  );
};
