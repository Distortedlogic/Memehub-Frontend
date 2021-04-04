import { Divider, Flex } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Positions } from "src/components/portfolio/Positions";
import { TradeHistory } from "src/components/portfolio/TradeHistory";
import { useIsAuth } from "src/hooks/isAuth";
import { urqlClient } from "src/urql/urqlClient";
import { DoubleColLayout } from "../_doubleColLayout";

interface portfolioProps {}

const portfolio: React.FC<portfolioProps> = () => {
  const [{ data, fetching, error }] = useIsAuth();
  if (error) console.log(error);
  if (fetching || error || !data?.me)
    return (
      <DoubleColLayout>
        <></>
      </DoubleColLayout>
    );
  const { me } = data;
  return (
    <DoubleColLayout>
      <Flex mb={4} pl={6} minHeight="80vh" direction="column">
        <Positions maxHeight="80vh" overflow="auto" userId={me.id} />
        <Divider my={4} />
        <TradeHistory maxHeight="80vh" overflow="auto" userId={me.id} />
      </Flex>
    </DoubleColLayout>
  );
};
export default withUrqlClient(urqlClient)(portfolio);
