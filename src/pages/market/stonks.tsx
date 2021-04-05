import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { Flex, Grid, GridItem, Text } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { HiveTicker } from "src/components/RightSideBar/HiveTicker";
import { Leaderboards } from "src/components/RightSideBar/Leaderboards";
import { StonkGrid } from "src/components/stonk/StonkGrid";
import { urqlClient } from "src/urql/urqlClient";
import { NavLayout } from "../_navLayout";

interface StonksProps {}

const Stonks: React.FC<StonksProps> = () => {
  const router = useRouter();
  const [order, setOrder] = useState("marketcap");
  const [onlyPositions, setOnlyPositions] = useState(false);
  return (
    <NavLayout>
      <Grid templateColumns="3fr 1fr" w="100%" backgroundColor="black">
        <StonkGrid order={order} onlyPositions={onlyPositions} />
        <GridItem pt={2} mr={2} position="sticky" top="0">
          <Flex direction="column" w="100%">
            <Button onClick={() => router.push("/market/info")}>
              Sonk Market Info
            </Button>
          </Flex>
          <Flex justifyContent="space-between" mt={2} w="100%">
            <Button onClick={() => setOrder("marketcap")} w="49%">
              Marketcap
            </Button>
            <Button onClick={() => setOrder("price")} w="49%">
              Price
            </Button>
          </Flex>
          <Flex justifyContent="center" alignItems="center">
            <Checkbox mt={2} onChange={() => setOnlyPositions(!onlyPositions)}>
              <Text>Show Positions</Text>
            </Checkbox>
          </Flex>
          <HiveTicker />
          <Leaderboards position="sticky" top="20vh" />
        </GridItem>
      </Grid>
    </NavLayout>
  );
};
export default withUrqlClient(urqlClient)(Stonks);
