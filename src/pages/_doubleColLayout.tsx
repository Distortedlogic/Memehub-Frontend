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
    <>
      <Grid
        position="sticky"
        zIndex={1000}
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
      <Grid templateColumns="3fr 1fr" w="100%" backgroundColor="black">
        <GridItem>{props.children}</GridItem>
        <GridItem mr={2} position="sticky" top="0">
          <HiveTicker />
          <Leaderboards position="sticky" top="20vh" />
        </GridItem>
      </Grid>
    </>
  );
};
