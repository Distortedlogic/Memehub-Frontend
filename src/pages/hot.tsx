import { Flex } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { MemeGrid } from "src/components/meme/MemeGrid";
import { useHotMemesQuery } from "src/generated/graphql";
import { urqlClient } from "src/urql/urqlClient";
import { DoubleColLayout } from "./_doubleColLayout";

interface HotProps {}
const take = 8;
const Hot: React.FC<HotProps> = ({}) => {
  const [skip, setSkip] = useState(0);
  const [{ data, error, fetching }] = useHotMemesQuery({
    variables: { skip, take },
  });
  const loadMore = () => setSkip(skip + take);
  if (error) {
    console.log("error", error);
  }
  if (!data?.hotMemes || fetching) {
    return (
      <DoubleColLayout>
        <Flex h="80vh"></Flex>
      </DoubleColLayout>
    );
  } else {
    const { hasMore, items: memes } = data.hotMemes;
    return (
      <DoubleColLayout>
        <Flex justifyContent="center" alignItems="center" minHeight="80vh">
          <MemeGrid pagedMemes={memes} hasMore={hasMore} loadMore={loadMore} />
        </Flex>
      </DoubleColLayout>
    );
  }
};
export default withUrqlClient(urqlClient)(Hot);
