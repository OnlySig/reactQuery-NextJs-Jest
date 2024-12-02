/* eslint-disable react/prop-types */
import Image from "next/image";
import { Avatar } from "../Avatar";
import { Star } from "../icons/Star";
import styles from "./cardpost.module.css";
import Link from "next/link";
import { ThumbsUpButton } from "./ThumbsUpButton";
import { ModalComment } from "../ModalComment";
import React from "react";
import { useThumbsMutation } from "@/hooks/useThumbsMutations";
import useCommentMutation from "@/hooks/useCommentMutation";

export const CardPost = ({
  post,
  highlight,
  rating,
  category,
  isFetching,
  currentPage,
}) => {
  const thumbsMutation = useThumbsMutation({ slug: post?.slug, currentPage })
  const submitCommentMutation = useCommentMutation(currentPage, post?.id)
  const handleThumbsMutation = (e) => {
    e.preventDefault();

    !highlight ? thumbsMutation.mutate({ slug: post.slug, currentPage }) : thumbsMutation.mutate({ slug: post.slug });
  }
  const handleSubmitComment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const textAreaValue = formData.get("text");
    submitCommentMutation.mutate({ id: post.id, text: textAreaValue });
  };
  // useEffect(() => {
  //   //? esse useEffect é para tirar a necessidade de atualizar pelo useQuery: queryClient.invalidateQueries de post e posts.
  //   //? da forma q estamos usando o useQuery so vai fazer o mutation de likes e esse useEffect vai atualizar a ui.
  //   //? assim nos tiramos a necessidade de ter q (buscar / invalidar queries) post e posts a cada like dado.
  //   //? chamamos isso de atualização otimista via ui.
  //   if (thumbsMutation.isPending && thumbsMutation.variables)
  //     post.likes += 1;
  // }, [thumbsMutation.isPending, thumbsMutation.variables])
  return (
    <article className={styles.card} style={{ width: highlight ? 993 : 486 }}>
      <header className={styles.header}>
        <figure style={{ height: highlight ? 300 : 133 }}>
          <Image
            src={post.cover}
            fill
            alt={`Capa do post de titulo: ${post.title}`}
          />
        </figure>
      </header>
      <section className={styles.body}>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        <Link href={`/posts/${post.slug}`}>Ver detalhes</Link>
      </section>
      <footer className={styles.footer}>
        <div className={styles.actions}>
          <form onClick={handleThumbsMutation}>
            <ThumbsUpButton disable={isFetching} />
            <p>{post.likes}</p>
          </form>
          <div>
            <ModalComment onSubmit={handleSubmitComment} />
            <p>{post.comments.length}</p>
          </div>
          {rating && (
            <div style={{ margin: "0 3px" }}>
              <Star />
              <p style={{ marginTop: "1px" }}>{rating}</p>
            </div>
          )}
        </div>
        {category && (
          <div
            className={styles.categoryWrapper}
            style={{ fontSize: highlight ? "15px" : "12px" }}
          >
            <span className={styles.label}>Categoria: </span>{" "}
            <span className={styles.category}>{category}</span>
          </div>
        )}
        <Avatar imageSrc={post.author.avatar} name={post.author.username} />
      </footer>
    </article>
  );
};
