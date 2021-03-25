import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { LeftSideBar } from "src/components/LeftSideBar";
import { NavBar } from "src/components/NavBar";
import { HiveTicker } from "src/components/RightSideBar/HiveTicker";
import { Leaderboards } from "src/components/RightSideBar/Leaderboards";

interface DoubleColLayoutProps {
  children: React.ReactNode;
}

export const DoubleColLayout: React.FC<DoubleColLayoutProps> = (props) => {
  return (
    <Grid
      h="100%"
      w="100%"
      templateRows="10vh 90vh"
      templateColumns="2fr 6fr 3fr"
    >
      <GridItem borderBottom="1px solid black" rowSpan={1} colSpan={3}>
        <NavBar />
      </GridItem>
      <GridItem overflow="auto" borderRight="1px solid black">
        <LeftSideBar />
      </GridItem>
      <GridItem overflow="auto">{props.children}</GridItem>
      <GridItem overflow="auto" borderRight="1px solid black">
        <HiveTicker />
        <Leaderboards />
      </GridItem>
    </Grid>
  );
};
