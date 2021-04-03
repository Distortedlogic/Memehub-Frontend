import { Flex, Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { MiniNavBar } from "src/components/MiniNavBar";
import { NavBar } from "src/components/NavBar";

interface SingleColLayoutProps {
  children: React.ReactNode;
}

export const SingleColLayout: React.FC<SingleColLayoutProps> = (props) => {
  return (
    <>
      <Grid
        position="sticky"
        backgroundColor="black"
        zIndex={1000}
        top={0}
        w="100%"
        templateRows="10vh 10vh"
      >
        <GridItem borderBottom="1px solid black">
          <NavBar />
        </GridItem>
        <GridItem borderBottom="1px solid black">
          <MiniNavBar />
        </GridItem>
      </Grid>
      <Flex direction="column" w="100%">
        {props.children}
      </Flex>
    </>
  );
};
