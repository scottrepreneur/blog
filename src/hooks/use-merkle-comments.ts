import { useEffect, useState } from "react";

const useMerkleComments = ({ root }: { root: string }) => {
  const [merkleComments, setMerkleComments] = useState<any[]>();

  const getMerkleRoot = async (merkleRoot: string) => {
    const uri = `https://searchcaster.xyz/api/search?merkleRoot=${merkleRoot}`;
    const res = await fetch(uri, {
      // @ts-ignore next-line
      next: { revalidate: 1 * 30 },
    }).then((res) => res.json());
    const casts = res.casts;
    setMerkleComments(casts);
  };

  useEffect(() => {
    if (root) {
      getMerkleRoot(root);
    }
  }, [root]);

  return { data: merkleComments, isLoading: !merkleComments };
};

export default useMerkleComments;
