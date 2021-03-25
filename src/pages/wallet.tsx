import { Divider, Flex, Text } from "@chakra-ui/layout";
import { Asset } from "@hiveio/dhive";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { useMeQuery } from "src/generated/graphql";
import { hive } from "src/hiveConnection";
import { urqlClient } from "src/urql/urqlClient";
import useAsyncEffect from "use-async-effect";
import { DoubleColLayout } from "./_doubleColLayout";

interface WalletProps {}

const Wallet: React.FC<WalletProps> = () => {
  const [{ data, error, fetching }] = useMeQuery();
  const [hiveBlance, setHiveBlance] = useState<string | Asset | undefined>(
    undefined
  );

  if (error) console.log("error", error);
  if (error || fetching || !data) {
    return (
      <DoubleColLayout>
        <></>
      </DoubleColLayout>
    );
  }
  useAsyncEffect(async () => {
    if (data.me) {
      setHiveBlance(
        (await hive.database.getAccounts([data.me.username]))[0].balance
      );
    }
  }, [data]);
  return (
    <DoubleColLayout>
      <Flex direction="column" p={6}>
        <Flex p={6} justifyContent="space-between" alignItems="center">
          <Flex direction="column">
            <Text fontWeight="bold" fontSize="25px">
              Memehub Points
            </Text>
            <Text>
              The primary points of the Memehub Platform, eventually will be
              tokenized.
            </Text>
          </Flex>
          <Text>{data.me?.totalPoints}</Text>
        </Flex>
        <Divider />
        <Flex p={6} justifyContent="space-between" alignItems="center">
          <Flex direction="column">
            <Text fontWeight="bold" fontSize="25px">
              Hive
            </Text>
            <Text>
              The primary points of the Memehub Platform, eventually will be
              tokenized.
            </Text>
          </Flex>
          <Text>{hiveBlance}</Text>
        </Flex>
      </Flex>
    </DoubleColLayout>
  );
};
export default withUrqlClient(urqlClient)(Wallet);
