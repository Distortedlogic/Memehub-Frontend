import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { MiniNavBar } from "src/components/MiniNavBar";
import { NavBar } from "src/components/NavBar";
import { HiveTicker } from "src/components/RightSideBar/HiveTicker";
import { Leaderboards } from "src/components/RightSideBar/Leaderboards";

interface DoubleColLayoutProps {
  children: React.ReactNode;
}

export const DoubleColLayout: React.FC<DoubleColLayoutProps> = (props) => {
  return (
    <Grid h="100%" w="100%" templateRows="10vh 7vh 83vh">
      <GridItem>
        <NavBar />
      </GridItem>
      <GridItem borderTop="1px solid black" borderBottom="1px solid black">
        <MiniNavBar />
      </GridItem>
      <Grid overflow="auto" templateColumns="3fr 1fr">
        <GridItem>{props.children}</GridItem>
        <GridItem position="sticky" bottom="0" borderRight="1px solid black">
          <HiveTicker />
          <Leaderboards />
        </GridItem>
      </Grid>
    </Grid>
  );
};
