import { Grid, GridItem } from "@chakra-ui/layout";
import React from "react";
import { MiniNavBar } from "src/components/MiniNavBar";
import { NavBar } from "src/components/NavBar";

interface NavLayoutProps {
  children: React.ReactNode;
}

export const NavLayout: React.FC<NavLayoutProps> = (props) => {
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
      {props.children}
    </>
  );
};
