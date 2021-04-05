import { Button } from "@chakra-ui/button";
import { Box, Flex } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { Ranking } from "src/components/user/Ranking";
import { urqlClient } from "src/urql/urqlClient";
import { DoubleColLayout } from "../_doubleColLayout";

interface RankingsProps {}

const Rankings: React.FC<RankingsProps> = () => {
  const [timeFrame, setTD] = useState("ever");
  return (
    <DoubleColLayout>
      <Box>
        <Flex
          p={4}
          mt={2}
          justifyContent="center"
          alignItems="center"
          rounded="md"
          backgroundColor="black"
        >
          <Button
            onClick={() => setTD("day")}
            colorScheme={timeFrame === "day" ? "blue" : "gray"}
            mx={2}
          >
            Daily
          </Button>
          <Button
            onClick={() => setTD("week")}
            colorScheme={timeFrame === "week" ? "blue" : "gray"}
            mx={2}
          >
            Weekly
          </Button>
          <Button
            onClick={() => setTD("month")}
            colorScheme={timeFrame === "month" ? "blue" : "gray"}
            mx={2}
          >
            Monthly
          </Button>
          <Button
            onClick={() => setTD("ever")}
            colorScheme={timeFrame === "ever" ? "blue" : "gray"}
            mx={2}
          >
            Ever
          </Button>
        </Flex>
        <Flex w="100%">
          <Ranking isMhp={true} timeFrame={timeFrame} />
          <Ranking isMhp={false} timeFrame={timeFrame} />
        </Flex>
      </Box>
    </DoubleColLayout>
  );
};

export default withUrqlClient(urqlClient)(Rankings);
