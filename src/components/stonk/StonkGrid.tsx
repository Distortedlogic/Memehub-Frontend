import { Box, Divider, Flex, Grid } from "@chakra-ui/layout";
import React, { Fragment, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { loader } from "src/components/utils/loader";
import { useStonksQuery } from "src/generated/graphql";
import { useStoreState } from "src/store/store";
import { endMessage } from "../utils/endMessage";
import { ScrollToTop } from "../utils/ScrollToTop";
import { StonkBox } from "./StonkBox";
import { StonkCard } from "./StonkCard";
import { StonkGraph } from "./StonkGraph";

type StonkGridProps = {
  order: string;
  onlyPositions: boolean;
};
const take = 16;
export const StonkGrid: React.FC<StonkGridProps> = ({
  order,
  onlyPositions,
}) => {
  const {
    settings: { gridView },
  } = useStoreState((state) => state);
  const [skip, setSkip] = useState(0);
  const [{ data, fetching, error }] = useStonksQuery({
    variables: { skip, take, order, onlyPositions },
  });
  const loadMore = () => setSkip(skip + take);
  if (error) console.log(error);
  if (fetching || error || !data?.stonks) {
    return <Flex h="80vh"></Flex>;
  }
  const StonkDisplay = gridView === "list" ? StonkCard : StonkBox;
  const { hasMore, items: stonks } = data.stonks;
  const graphHeight = "200px";
  const stonkComponents = stonks.map((stonk) => (
    <Fragment key={stonk.name}>
      <Flex justifyContent="center">
        <StonkDisplay stonk={stonk} />
        {gridView === "blog" ? (
          <Flex w="100%" direction="column">
            <Flex h={graphHeight} w="100%">
              <StonkGraph
                minHeight={graphHeight}
                isMarketcap={true}
                name={stonk.name}
              />
            </Flex>
            <Flex h={graphHeight} w="100%">
              <StonkGraph
                minHeight={graphHeight}
                isMarketcap={false}
                name={stonk.name}
              />
            </Flex>
          </Flex>
        ) : null}
      </Flex>
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
