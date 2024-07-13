import React from "react";

import _ from "lodash";

import { useMerkleComments, useSiteMetadata } from "@/hooks";

import * as styles from "./Comments.module.scss";

interface Props {
  slug: string;
  comment: any;
  comments?: any;
}

type CommentProps = {
  depth: number;
} & Props;

const commentBorderColors = [
  "#57ff6577",
  "#82e4ff77",
  "red",
  "yellow",
  "purple",
  "orange",
];

const prepareFarcasterUri = (uri: string) =>
  uri.replace("farcaster://casts/", "https://discove.xyz/threads/");

const Comment = ({ slug, comment, comments, depth }: CommentProps) => {
  const { url, farcasterUrl } = useSiteMetadata();

  const commentBody = comment.body.data?.text?.replace(`${url}${slug}`, "");

  const children = _.filter(comments, [
    "body.data.replyParentMerkleRoot",
    comment.merkleRoot,
  ]);

  return (
    <div
      key={comment.id}
      className={styles.comment}
      style={{
        marginLeft: depth > 0 ? "2px" : undefined,
        borderLeft: `2px solid ${commentBorderColors[depth]}`,
      }}
    >
      <div className={styles.body}>{commentBody}</div>
      <div className={styles.footer}>
        <a href={`${farcasterUrl}/@${comment.body.username}`}>
          <div className={styles.author}>
            <img
              src={comment.meta.avatar}
              alt={comment.meta.displayName}
              className={styles.avatar}
            />
            <span className={styles.name}>{comment.meta.displayName}</span>
          </div>
        </a>

        <a href={`${prepareFarcasterUri(comment.uri)}`}>
          <div className={styles.date}>
            {new Date(comment.body.publishedAt).toLocaleDateString()}
          </div>
        </a>
      </div>
      {children.map((child) => (
        <Comment
          slug={slug}
          comment={child}
          comments={comments}
          depth={depth + 1}
        />
      ))}
    </div>
  );
};

const TopLevelComment = ({ slug, comment }: Props) => {
  const { data: comments } = useMerkleComments({
    root: comment.merkleRoot,
  });
  const topLevelComment = _.find(comments, [
    "body.data.replyParentMerkleRoot",
    null,
  ]);
  const depth = 0;

  if (!topLevelComment) {
    return null;
  }

  return (
    <Comment
      slug={slug}
      comment={topLevelComment}
      comments={comments}
      depth={depth}
    />
  );
};

export default TopLevelComment;
