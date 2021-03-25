import { Text } from "@chakra-ui/layout";
import React, { useState } from "react";
import { useTopRatedMemesQuery } from "src/generated/graphql";
import { SingleColLayout } from "src/pages/_singleColLayout";
import { MemeGrid } from "./MemeGrid";

interface TopRatedProps {
  days: number;
}

const take = 16;

export const TopRated: React.FC<TopRatedProps> = ({ days }) => {
  const [skip, setSkip] = useState(0);
  const [{ data, error, fetching }] = useTopRatedMemesQuery({
    variables: { skip, take, days },
  });
  const loadMore = () => setSkip(skip + take);
  if (error) console.log("error", error);
  if (!data || fetching) {
    return (
      <SingleColLayout>
        <Text>Loading ...</Text>
      </SingleColLayout>
    );
  } else {
    const { hasMore, items: memes } = data!.topRatedMemes;
    return (
      <SingleColLayout>
        <MemeGrid pagedMemes={memes} hasMore={hasMore} loadMore={loadMore} />
      </SingleColLayout>
    );
  }
};
