import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { NavBar } from "src/components/NavBar";
import { SideBar } from "src/components/SideBar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = (props) => {
  return (
    <Grid h="100%" w="100%" templateRows="10vh 90vh" templateColumns="2fr 9fr">
      <GridItem borderBottom="1px solid black" rowSpan={1} colSpan={2}>
        <NavBar />
      </GridItem>
      <GridItem h="100%" borderRight="1px solid black">
        <SideBar />
      </GridItem>
      <GridItem h="100%">{props.children}</GridItem>
    </Grid>
  );
};
