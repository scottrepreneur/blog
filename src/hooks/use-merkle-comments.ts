import { useEffect, useState } from "react";

const useMerkleComments = ({ root }: { root: string }) => {
  const [merkleComments, setMerkleComments] = useState<any[]>();

  const getMerkleRoot = async (merkleRoot: string) => {
    const uri = `https://searchcaster.xyz/api/search?merkleRoot=${merkleRoot}`;
    const result = await fetch(uri, {
      // @ts-ignore next-line
      next: { revalidate: 1 * 30 },
    }).then((res: any) => res.json());
    const casts = result.casts;
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
