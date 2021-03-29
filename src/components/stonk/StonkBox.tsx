import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Box, BoxProps, Flex, Text } from "@chakra-ui/layout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import { StonkFragment } from "src/generated/graphql";
dayjs.extend(relativeTime);

interface StonkProps extends BoxProps {
  stonk: StonkFragment;
}

export const StonkBox: React.FC<StonkProps> = (props) => {
  let { stonk } = props;

  return (
    <Box {...props} py={4} rounded="md" backgroundColor="black">
      <Flex
        _hover={{ cursor: "pointer" }}
        justifyContent="center"
        alignItems="center"
      >
        <Image rounded="md" w="150px" src={stonk.url} />
      </Flex>
      <Text mt={2} fontWeight="bold" textAlign="center">
        {stonk.name}
      </Text>
      <Text textAlign="center" size="sm" m={1}>
        Marketcap - {stonk.marketcap}
      </Text>
      <Text textAlign="center" size="sm" m={1}>
        Price - {stonk.price}
      </Text>
      <Flex mt={2} justifyContent="center" align="center">
        <Button size="sm" m={1}>
          Buy
        </Button>
        <Button size="sm" m={1}>
          sell
        </Button>
      </Flex>
    </Box>
  );
};
