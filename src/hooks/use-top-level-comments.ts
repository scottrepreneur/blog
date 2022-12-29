import { useEffect, useState } from "react";

import useSiteMetadata from "./use-site-metadata";

// TODO - this is a hack to filter out my own top level posts, still included in downstream posts

const useComments = ({ slug }: { slug: string }) => {
  const [comments, setComments] = useState<any[]>();
  const [isLoading, setIsLoading] = useState(true);

  const { url } = useSiteMetadata();

  useEffect(() => {
    const fetchComments = async () => {
      const uri = `https://searchcaster.xyz/api/search?text=${url}${slug}`;

      const res = await fetch(uri).then((r) => r.json());
      const casts = res.casts;
      // const filteredCasts = casts.filter((cast: any) => {
      //   return cast.body.username !== "scottrepreneur";
      // });

      setComments(casts);
      setIsLoading(false);
    };
    if (slug) {
      fetchComments();
    }
  }, [slug]);

  return { data: comments, isLoading };
};

export default useComments;
