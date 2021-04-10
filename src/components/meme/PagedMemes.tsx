import { Box, Divider, Flex, Grid } from "@chakra-ui/layout";
import React, { Fragment } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { loader } from "src/components/utils/loader";
import {
  MemeFragment,
  UserFragment,
  UserMemeFragment,
} from "src/generated/graphql";
import { useStoreState } from "src/store/store";
import { endMessage } from "../utils/endMessage";
import { ScrollToTop } from "../utils/ScrollToTop";
import { MemeBlog } from "./MemeBlog";
import { MemeList } from "./MemeList";

interface PagedMemesProps {
  hasMore: boolean;
  loadMore: () => void;
  pagedMemes: (UserMemeFragment | MemeFragment)[];
  user?: UserFragment;
}

export const PagedMemes: React.FC<PagedMemesProps> = ({
  hasMore,
  pagedMemes,
  user,
  loadMore,
}) => {
  const {
    settings: { gridView },
  } = useStoreState((state) => state);

  const MemeDisplay = gridView === "list" ? MemeList : MemeBlog;
  const memeComponents = pagedMemes.map((meme) => (
    <Fragment key={meme.id}>
      <MemeDisplay
        mb={2}
        displayUser={user ? false : true}
        meme={meme}
        user={user ? user : (meme as UserMemeFragment).user}
      />
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
