import { Box, Divider, Flex, Grid } from "@chakra-ui/layout";
import React, { Fragment, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { endMessage } from "src/components/utils/endMessage";
import { loader } from "src/components/utils/loader";
import { useStonksQuery } from "src/generated/graphql";
import { useStoreState } from "src/store/store";
import { ScrollToTop } from "../utils/ScrollToTop";
import { StonkBox } from "./StonkBox";
import { StonkCard } from "./StonkCard";

type StonkGridProps = {};
const take = 16;
export const StonkGrid: React.FC<StonkGridProps> = ({}) => {
  const {
    settings: { gridView },
  } = useStoreState((state) => state);
  const [skip, setSkip] = useState(0);
  const [{ data, fetching, error }] = useStonksQuery({
    variables: { skip, take, order: "test" },
  });
  const loadMore = () => setSkip(skip + take);
  if (error) console.log(error);
  if (fetching || error || !data?.stonks) {
    return <></>;
  }
  const StonkDisplay = gridView === "list" ? StonkCard : StonkBox;
  const { hasMore, items: stonks } = data.stonks;
  const stonkComponents = stonks.map((stonk) => (
    <Fragment key={stonk.name}>
      <StonkDisplay stonk={stonk} />
      <Divider />
    </Fragment>
  ));
  const grid =
    gridView === "grid" ? (
      <Grid gridTemplateColumns="repeat(3, 1fr)">
        <Box ml={4} mr={2}>
          {stonkComponents.filter((_, i) => i % 3 === 0)}
        </Box>
        <Box ml={2} mr={4}>
          {stonkComponents.filter((_, i) => i % 3 === 1)}
        </Box>
        <Box ml={2} mr={4}>
          {stonkComponents.filter((_, i) => i % 3 === 2)}
        </Box>
      </Grid>
    ) : (
      <Flex alignItems="center" justifyContent="center">
        <Flex direction="column" w="60%">
          {stonkComponents}
        </Flex>
      </Flex>
    );

  return (
    <InfiniteScroll
      dataLength={stonks.length}
      next={loadMore}
      hasMore={hasMore}
      loader={loader}
      endMessage={endMessage}
    >
      {grid}
      <ScrollToTop />
    </InfiniteScroll>
  );
};
