import { Flex, Link, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useAsyncEffect } from "use-async-effect";

interface HiveTickerProps {}

export const HiveTicker: React.FC<HiveTickerProps> = () => {
  const [hivePrice, setHivePrice] = useState(0);
  const [hbdPrice, setHbdPrice] = useState(0);
  const [reload, setReload] = useState(false);
  useAsyncEffect(
    async (isMounted) => {
      if (!isMounted()) return;
      setHivePrice(
        (
          await (
            await fetch(
              "https://min-api.cryptocompare.com/data/price?fsym=HIVE&tsyms=USD"
            )
          ).json()
        ).USD
      );
      setHbdPrice(
        (
          await (
            await fetch(
              "https://min-api.cryptocompare.com/data/price?fsym=HBD&tsyms=USD"
            )
          ).json()
        ).USD
      );
      return setTimeout(() => setReload(!!reload), 1000 * 60 * 15);
    },
    (id) => {
      if (id) clearTimeout(id);
    },
    [setReload, setHbdPrice, setHivePrice, reload]
  );
  return (
    <Flex
      mt={2}
      px={6}
      py={4}
      justifyContent="space-around"
      alignItems="center"
      backgroundColor="black"
      rounded="md"
    >
      <Link href="https://ionomy.com/en/markets/btc-hive" target="_blank">
        <Flex direction="column" justifyContent="center" alignItems="center">
          <Text fontWeight="bold" color="white">
            Hive
          </Text>
          <Text color="white">{hivePrice} USD</Text>
        </Flex>
      </Link>
      <Link href="https://ionomy.com/en/markets/btc-hbd" target="_blank">
        <Flex direction="column" justifyContent="center" alignItems="center">
          <Text fontWeight="bold" color="white">
            HBD
          </Text>
          <Text color="white">{hbdPrice} USD</Text>
        </Flex>
      </Link>
    </Flex>
  );
};
