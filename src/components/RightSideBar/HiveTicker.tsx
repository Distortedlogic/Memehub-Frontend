import { Flex, FlexProps, Link, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useAsyncEffect } from "use-async-effect";

interface HiveTickerProps extends FlexProps {}

export const HiveTicker: React.FC<HiveTickerProps> = (flexProps) => {
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
      {...flexProps}
    >
      <Link
        _hover={{ cursor: "pointer" }}
        _focus={{}}
        href="https://bittrex.com/Market/Index?MarketName=USD-HIVE"
        target="_blank"
      >
        <Flex direction="column" justifyContent="center" alignItems="center">
          <Text fontWeight="bold">Hive</Text>
          <Text>{hivePrice} USD</Text>
        </Flex>
      </Link>
      <Link
        _hover={{ cursor: "pointer" }}
        _focus={{}}
        href="https://bittrex.com/Market/Index?MarketName=BTC-HBD"
        target="_blank"
      >
        <Flex direction="column" justifyContent="center" alignItems="center">
          <Text fontWeight="bold">HBD</Text>
          <Text>{hbdPrice} USD</Text>
        </Flex>
      </Link>
    </Flex>
  );
};
