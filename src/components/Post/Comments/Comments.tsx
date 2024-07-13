import React from "react";

import { useSiteMetadata, useTopLevelComments } from "@/hooks";

import TopLevelComment from "./TopLevelComment";

import * as styles from "./Comments.module.scss";

interface Props {
  post: any;
}

const Comments: React.FC<Props> = ({ post }: Props) => {
  const { farcasterUrl, url } = useSiteMetadata();
  const { slug } = post.fields;
  const { callToFeedback } = post.frontmatter;
  const { data: comments, isLoading } = useTopLevelComments({ slug });

  if (isLoading) {
    return (
      <div className={styles.comments}>
        <h3>Comments</h3>
        <p>Loading comments...</p>
      </div>
    );
  }

  const hasComments = (comments && comments.length > 0) || false;

  if (!hasComments) {
    return (
      <div className={styles.comments}>
        <h3>Comments</h3>
        <p>
          There are no comments yet. When you share this post on{" "}
          <a href={`${farcasterUrl}/?q=${url}${slug}`}>Farcaster</a> it will
          show up in the comments here. 👇
          {callToFeedback ? (
            <>
              <br />
              <br />
              <span className={styles.callToFeedback}>{callToFeedback}</span>
            </>
          ) : (
            <>
              <br />
              <br />
              <span className={styles.callToFeedback}>
                What are you learning about currently?
              </span>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.comments}>
      <h3>Comments</h3>
      <a href={`${farcasterUrl}/?q=${url}${slug}`} className={styles.helper}>
        Share this post on Farcaster to add a comment.
      </a>
      {comments?.map((comment) => (
        <TopLevelComment
          slug={slug}
          comment={comment}
          key={comment.merkleRoot}
        />
      ))}
    </div>
  );
};

export default Comments;
