import React from "react";

import { Link } from "gatsby";

import { Image } from "@/components/Image";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

import * as styles from "./Author.module.scss";

type Props = {
  author: {
    name: string;
    bio: string;
    photo: string;
    pronunciation: string;
    workingOn: {
      link: string;
      place: string;
      position: string;
    }[];
  };
  isIndex?: boolean;
};

const Author = ({ author, isIndex }: Props) => (
  <div className={styles.author}>
    <Link to="/">
      <Image alt={author.name} path={author.photo} className={styles.photo} />
    </Link>

    <div className={styles.titleContainer}>
      {isIndex ? (
        <h1 className={styles.title}>
          <Link className={styles.link} to="/">
            {author.name}
          </Link>
          {author.pronunciation && (
            <div className={styles.pronunciation}>{author.pronunciation}</div>
          )}
        </h1>
      ) : (
        <h2 className={styles.title}>
          <Link className={styles.link} to="/">
            {author.name}
          </Link>
          {author.pronunciation && (
            <div className={styles.pronunciation}>{author.pronunciation}</div>
          )}
        </h2>
      )}
      <ThemeSwitcher />
    </div>

    <p className={styles.subtitle}>{author.bio}</p>
    {author.workingOn && (
      <div>
        <div className={styles.workingLabel}>hacking on</div>
        {author.workingOn.map((work) => (
          <div key={work.position}>
            {work.position} @{" "}
            <a href={work.link} className={styles.workingLink} target="_blank">
              {work.place}
            </a>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default Author;
