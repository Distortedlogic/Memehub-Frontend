import { Box, Divider, Flex, Grid } from "@chakra-ui/layout";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { endMessage } from "src/components/utils/endMessage";
import { loader } from "src/components/utils/loader";
import {
  MemeFragment,
  UserFragment,
  UserMemeFragment,
} from "src/generated/graphql";
import { useStoreState } from "src/store/store";
import { ScrollToTop } from "../utils/ScrollToTop";
import { MemeBox } from "./MemeBox";
import { MemeCard } from "./MemeCard";

type MemeGridProps = {
  hasMore: boolean;
  loadMore: () => void;
  pagedMemes: (UserMemeFragment | MemeFragment)[];
  user?: UserFragment;
};

export const MemeGrid: React.FC<MemeGridProps> = ({
  hasMore,
  pagedMemes,
  user,
  loadMore,
}) => {
  const {
    settings: { gridView },
  } = useStoreState((state) => state);

  const MemeDisplay = gridView === "list" ? MemeCard : MemeBox;
  const memeComponents = pagedMemes.map((meme) => (
    <>
      <MemeDisplay
        mb={2}
        key={meme.id}
        topfull={user ? false : true}
        meme={meme}
        user={user ? user : (meme as UserMemeFragment).user}
      />
      <Divider />
    </>
  ));
  const grid =
    gridView === "grid" ? (
      <Grid gridTemplateColumns="repeat(3, 1fr)">
        <Box ml={4} mr={2}>
          {memeComponents.filter((_, i) => i % 3 === 0)}
        </Box>
        <Box ml={2} mr={4}>
          {memeComponents.filter((_, i) => i % 3 === 1)}
        </Box>
        <Box ml={2} mr={4}>
          {memeComponents.filter((_, i) => i % 3 === 2)}
        </Box>
      </Grid>
    ) : (
      <Flex alignItems="center" justifyContent="center">
        <Flex direction="column" w="60%">
          {memeComponents}
        </Flex>
      </Flex>
    );

  return (
    <InfiniteScroll
      dataLength={pagedMemes.length}
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
