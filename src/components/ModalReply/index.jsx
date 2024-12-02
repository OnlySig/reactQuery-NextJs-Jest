/* eslint-disable react/prop-types */
"use client";

import React, { useRef } from "react";
import { Modal } from "../Modal";
import styles from "./replymodal.module.css";
import { Textarea } from "../Textarea";
import { SubmitButton } from "../SubmitButton";
import { Comment } from "../Comment";

import useReplayMutation from "@/hooks/useReplayMutation";

export const ReplyModal = ({ comment, slug }) => {
  const modalRef = useRef(null);

  const openModal = () => {
    modalRef.current.openModal();
  };

  const mutationReplayModal = useReplayMutation(comment.id, slug, modalRef);

  const handleReplieSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const textAreaValue = formData.get("text");
    mutationReplayModal.mutate({ comment, text: textAreaValue });
  };
  return (
    <>
      <Modal ref={modalRef}>
        <form onSubmit={handleReplieSubmit}>
          <div className={styles.body}>
            <Comment comment={comment} />
          </div>
          <div className={styles.divider}></div>
          <Textarea
            required
            rows={8}
            name="text"
            placeholder="Digite aqui..."
          />
          <div className={styles.footer}>
            <SubmitButton>Responder</SubmitButton>
          </div>
        </form>
      </Modal>
      <button className={styles.btn} onClick={openModal}>
        Responder
      </button>
    </>
  );
};
