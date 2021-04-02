import { Button } from "@chakra-ui/button";
import { Flex, Grid, GridItem } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import React from "react";
import { HiveTicker } from "src/components/RightSideBar/HiveTicker";
import { Leaderboards } from "src/components/RightSideBar/Leaderboards";
import { NavLayout } from "../_navLayout";

interface MarketLayoutProps {
  children: React.ReactNode;
}

export const MarketLayout: React.FC<MarketLayoutProps> = (props) => {
  const router = useRouter();
  return (
    <NavLayout>
      <Grid templateColumns="3fr 1fr" w="100%" backgroundColor="black">
        {props.children}
        <GridItem pt={2} mr={2} position="sticky" top="0">
          <Flex direction="column" w="100%">
            <Button onClick={() => router.push("/market/info")}>
              Sonk Market Info
            </Button>
          </Flex>
          <HiveTicker />
          <Leaderboards />
        </GridItem>
      </Grid>
    </NavLayout>
  );
};
