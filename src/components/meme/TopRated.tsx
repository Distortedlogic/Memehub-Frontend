import { Flex } from "@chakra-ui/layout";
import React, { useState } from "react";
import { useTopRatedMemesQuery } from "src/generated/graphql";
import { DoubleColLayout } from "src/pages/_doubleColLayout";
import { PagedMemes } from "./PagedMemes";

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
  if (!data || fetching || !data.topRatedMemes) {
    return (
      <DoubleColLayout>
        <Flex h="80vh"></Flex>
      </DoubleColLayout>
    );
  } else {
    const { hasMore, items: memes } = data.topRatedMemes;
    return (
      <DoubleColLayout>
        <Flex justifyContent="center" alignItems="center" minHeight="80vh">
          <PagedMemes
            pagedMemes={memes}
            hasMore={hasMore}
            loadMore={loadMore}
          />
        </Flex>
      </DoubleColLayout>
    );
  }
};
