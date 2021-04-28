import { Box, Divider, Flex, Grid } from "@chakra-ui/layout";
import React, { Fragment } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { endMessage } from "src/components/utils/endMessage";
import { loader } from "src/components/utils/loader";
import { ScrollToTop } from "src/components/utils/ScrollToTop";
import { RedditMemeFragment } from "src/generated/graphql";
import { useStoreState } from "src/store/store";
import { BlogView } from "./BlogView";
import { ListView } from "./ListView";

interface PagedRedditMemesProps {
  hasMore: boolean;
  loadMore: () => void;
  pagedMemes: RedditMemeFragment[];
}

export const PagedRedditMemes: React.FC<PagedRedditMemesProps> = ({
  hasMore,
  pagedMemes,
  loadMore,
}) => {
  const {
    settings: { gridView },
  } = useStoreState((state) => state);

  const MemeDisplay = gridView === "list" ? ListView : BlogView;
  const memeComponents = pagedMemes.map((meme) => (
    <Fragment key={meme.id}>
      <MemeDisplay mb={2} meme={meme} />
      <Divider />
    </Fragment>
  ));
  const grid =
    gridView === "grid" ? (
      <Grid ml={3} gridTemplateColumns="repeat(3, 1fr)">
        <Box ml={1} mr={1}>
          {memeComponents.filter((_, i) => i % 3 === 0)}
        </Box>
        <Box ml={1} mr={1}>
          {memeComponents.filter((_, i) => i % 3 === 1)}
        </Box>
        <Box ml={1} mr={1}>
          {memeComponents.filter((_, i) => i % 3 === 2)}
        </Box>
      </Grid>
    ) : (
      <Flex alignItems="center" justifyContent="center">
        <Flex direction="column" w={gridView === "blog" ? "60%" : "100%"}>
          {memeComponents}
        </Flex>
      </Flex>
    );

  return (
    <InfiniteScroll
      dataLength={memeComponents.length}
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
