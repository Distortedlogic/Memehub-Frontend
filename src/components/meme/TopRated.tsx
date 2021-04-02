import { Text } from "@chakra-ui/layout";
import React, { useState } from "react";
import { useTopRatedMemesQuery } from "src/generated/graphql";
import { DoubleColLayout } from "src/pages/_doubleColLayout";
import { SingleColLayout } from "src/pages/_singleColLayout";
import { useStoreState } from "src/store/store";
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
  const {
    settings: { gridView },
  } = useStoreState((state) => state);
  if (error) console.log("error", error);
  if (!data || fetching || !data.topRatedMemes) {
    return (
      <SingleColLayout>
        <Text>Loading ...</Text>
      </SingleColLayout>
    );
  } else {
    const { hasMore, items: memes } = data.topRatedMemes;
    if (gridView == "grid") {
      return (
        <SingleColLayout>
          <MemeGrid pagedMemes={memes} hasMore={hasMore} loadMore={loadMore} />
        </SingleColLayout>
      );
    } else {
      return (
        <DoubleColLayout>
          <MemeGrid pagedMemes={memes} hasMore={hasMore} loadMore={loadMore} />
        </DoubleColLayout>
      );
    }
  }
};
