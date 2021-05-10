import { Flex } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { DayTradeHistory } from "src/components/portfolio/DayTradeHistory";
import { useIsAuth } from "src/hooks/isAuth";
import DoubleColLayout from "src/pages/_doubleColLayout";
import { urqlClient } from "src/urql/urqlClient";

interface meProps {}

const me: React.FC<meProps> = () => {
  const [{ data, error, fetching }] = useIsAuth();
  const router = useRouter();
  if (error) {
    console.log("error", error);
  }
  if (fetching || error) {
    return (
      <DoubleColLayout>
        <Flex h="80vh"></Flex>
      </DoubleColLayout>
    );
  } else if (!data?.me) {
    router.push("/onboarding/hiveLogin");
    return (
      <DoubleColLayout>
        <Flex h="80vh"></Flex>
      </DoubleColLayout>
    );
  }
  return (
    <DoubleColLayout>
      <DayTradeHistory pt={4} m={2} userId={data.me.id} />
    </DoubleColLayout>
  );
};

export default withUrqlClient(urqlClient)(me);
