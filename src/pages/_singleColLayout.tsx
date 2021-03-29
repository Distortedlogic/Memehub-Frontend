import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { MiniNavBar } from "src/components/MiniNavBar";
import { NavBar } from "src/components/NavBar";

interface SingleColLayoutProps {
  children: React.ReactNode;
}

export const SingleColLayout: React.FC<SingleColLayoutProps> = (props) => {
  return (
    <Grid h="100%" w="100%" templateRows="10vh 10vh 80vh">
      <GridItem borderBottom="1px solid black">
        <NavBar />
      </GridItem>
      <GridItem borderBottom="1px solid black">
        <MiniNavBar />
      </GridItem>
      <GridItem overflow="auto">{props.children}</GridItem>
    </Grid>
  );
};
