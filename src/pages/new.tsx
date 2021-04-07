import { Flex } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { MemeGrid } from "src/components/meme/MemeGrid";
import { useNewMemesQuery } from "src/generated/graphql";
import { urqlClient } from "src/urql/urqlClient";
import { ssr } from "src/utils/constants";
import { DoubleColLayout } from "./_doubleColLayout";

const take = 32;
const New = () => {
  const [cursor, setCursor] = useState(null as null | string);
  const [{ data, fetching }] = useNewMemesQuery({
    variables: { take, cursor },
  });
  if (!data || fetching) {
    return (
      <DoubleColLayout>
        <Flex h="80vh"></Flex>
      </DoubleColLayout>
    );
  } else {
    const { hasMore, items: memes } = data!.newMemes;
    const loadMore = () => setCursor(memes![memes!.length - 1].createdAt);
    return (
      <DoubleColLayout>
        <Flex justifyContent="center" alignItems="center" minHeight="80vh">
          <MemeGrid pagedMemes={memes} hasMore={hasMore} loadMore={loadMore} />
        </Flex>
      </DoubleColLayout>
    );
  }
};

export default withUrqlClient(urqlClient, { ssr })(New);
