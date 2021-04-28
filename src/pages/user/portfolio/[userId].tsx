import { Divider, Flex } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Positions } from "src/components/portfolio/Positions";
import { TradeHistory } from "src/components/portfolio/TradeHistory";
import { urqlClient } from "src/urql/urqlClient";
import { DoubleColLayout } from "../../_doubleColLayout";

interface portfolioProps {}

const portfolio: React.FC<portfolioProps> = () => {
  const router = useRouter();
  if (!router.query.userId) {
    router.push("/onboarding/hiveLogin");
  }
  const userId = router.query.userId as string;
  return (
    <DoubleColLayout>
      <Flex mb={4} pl={6} minHeight="80vh" direction="column">
        <Positions maxHeight="60vh" overflow="auto" userId={userId} />
        <Divider my={4} />
        <TradeHistory maxHeight="60vh" overflow="auto" userId={userId} />
      </Flex>
    </DoubleColLayout>
  );
};
export default withUrqlClient(urqlClient)(portfolio);
