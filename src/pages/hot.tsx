import { Text } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { MemeGrid } from "src/components/meme/MemeGrid";
import { useHotMemesQuery } from "src/generated/graphql";
import { urqlClient } from "src/urql/urqlClient";
import { SingleColLayout } from "./_singleColLayout";

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
      <SingleColLayout>
        <Text>Loading ...</Text>
      </SingleColLayout>
    );
  } else {
    const { hasMore, items: memes } = data.hotMemes;
    return (
      <SingleColLayout>
        <MemeGrid pagedMemes={memes} hasMore={hasMore} loadMore={loadMore} />
      </SingleColLayout>
    );
  }
};
export default withUrqlClient(urqlClient)(Hot);
