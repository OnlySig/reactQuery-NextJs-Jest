/* eslint-disable react/prop-types */
import Image from "next/image";
import styles from "./comment.module.css";
import React from "react";

export const Comment = ({ comment }) => {
  return (
    <div className={styles.comment}>
      <Image
        src={comment.author.avatar}
        width={32}
        height={32}
        alt={`Avatar do(a) ${comment.author.name}`}
      />
      <strong>@{comment.author.name}</strong>
      <p>{comment.text}</p>
    </div>
  );
};
