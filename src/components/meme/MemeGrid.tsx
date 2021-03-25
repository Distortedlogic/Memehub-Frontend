import { Box, Grid } from "@chakra-ui/layout";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { endMessage } from "src/components/utils/endMessage";
import { loader } from "src/components/utils/loader";
import { UserMemeFragment } from "src/generated/graphql";
import { ScrollToTop } from "../utils/ScrollToTop";
import { MemeBox } from "./MemeBox";

interface MemeGridProps {
  pagedMemes: UserMemeFragment[];
  hasMore: boolean;
  loadMore: () => void;
}

export const MemeGrid: React.FC<MemeGridProps> = ({
  hasMore,
  pagedMemes,
  loadMore,
}) => {
  const memeComponents = pagedMemes.map((meme) => (
    <MemeBox mb={2} w="100%" key={meme.id} meme={meme} />
  ));
  const col0 = memeComponents.filter((_, i) => i % 2 === 0);
  const col1 = memeComponents.filter((_, i) => i % 2 === 1);
  return (
    <InfiniteScroll
      dataLength={memeComponents.length}
      next={loadMore}
      hasMore={hasMore}
      loader={loader}
      endMessage={endMessage}
    >
      <Grid gridTemplateColumns="repeat(2, 1fr)">
        <Box ml={4} mr={2}>
          {col0}
        </Box>
        <Box ml={2} mr={4}>
          {col1}
        </Box>
      </Grid>
      <ScrollToTop />
    </InfiniteScroll>
  );
};
