import { Checkbox } from "@chakra-ui/checkbox";
import { Flex, Grid, GridItem, Text } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { MiniNavBar } from "src/components/MiniNavBar";
import { NavBar } from "src/components/NavBar";
import { PagedRedditMemes } from "src/components/reddit/meme/PagedRedditMemes";
import { HiveTicker } from "src/components/RightSideBar/HiveTicker";
import { Leaderboards } from "src/components/RightSideBar/Leaderboards";
import { useLatestRedditQuery } from "src/generated/graphql";
import { urqlClient } from "src/urql/urqlClient";

const take = 16;

interface NewProps {}

const New: React.FC<NewProps> = () => {
  const [skip, setSkip] = useState(0);
  const loadMore = () => setSkip(skip + take);
  const [view, setView] = useState("");
  const [{ data, fetching, error }] = useLatestRedditQuery({
    variables: { skip, take, view },
  });
  if (error) console.log(error);
  if (fetching || error || !data) return <></>;
  const { items: memes, hasMore } = data.latestReddit;
  return (
    <>
      <Grid
        position="sticky"
        zIndex={100}
        top={0}
        w="100%"
        templateRows="10vh 10vh"
        backgroundColor="black"
      >
        <GridItem>
          <NavBar />
        </GridItem>
        <GridItem borderTop="1px solid black" borderBottom="1px solid black">
          <MiniNavBar />
        </GridItem>
      </Grid>
      <Grid
        minHeight="80vh"
        templateColumns="3fr 1fr"
        w="100%"
        backgroundColor="black"
      >
        <GridItem>
          <PagedRedditMemes
            hasMore={hasMore}
            loadMore={loadMore}
            pagedMemes={memes}
          />
        </GridItem>
        <GridItem>
          <Flex justifyContent="center" alignItems="center">
            <Checkbox
              isChecked={view === "investable"}
              mt={2}
              onChange={() =>
                view === "investable" ? setView("") : setView("investable")
              }
            >
              <Text>Show Investable</Text>
            </Checkbox>
          </Flex>
          <Flex justifyContent="center" alignItems="center">
            <Checkbox
              isChecked={view === "investments"}
              mt={2}
              onChange={() =>
                view === "investments" ? setView("") : setView("investments")
              }
            >
              <Text>Show Investments</Text>
            </Checkbox>
          </Flex>
          <Flex position="sticky" top="20vh" mr={2} direction="column">
            <HiveTicker />
            <Leaderboards />
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
};
export default withUrqlClient(urqlClient)(New);
