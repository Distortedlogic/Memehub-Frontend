import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { LeftSideBar } from "src/components/LeftSideBar";
import { NavBar } from "src/components/NavBar";

interface SingleColLayoutProps {
  children: React.ReactNode;
}

export const SingleColLayout: React.FC<SingleColLayoutProps> = (props) => {
  return (
    <Grid h="100%" w="100%" templateRows="10vh 90vh" templateColumns="2fr 9fr">
      <GridItem borderBottom="1px solid black" rowSpan={1} colSpan={2}>
        <NavBar />
      </GridItem>
      <GridItem overflow="auto" borderRight="1px solid black">
        <LeftSideBar />
      </GridItem>
      <GridItem overflow="auto">{props.children}</GridItem>
    </Grid>
  );
};
