import { Image } from "@chakra-ui/image";
import { BoxProps, Flex, Text } from "@chakra-ui/layout";
import React from "react";
import { StonkFragment } from "src/generated/graphql";
import { BuyButton } from "./BuyButton";
import { SellButton } from "./SellButton";

interface StonkCardProps extends BoxProps {
  stonk: StonkFragment;
}

export const StonkCard: React.FC<StonkCardProps> = (props) => {
  let { stonk } = props;
  return (
    <Flex
      {...props}
      justifyContent="space-between"
      alignItems="center"
      p={4}
      rounded="md"
    >
      <Flex
        _hover={{ cursor: "pointer" }}
        justifyContent="center"
        alignItems="center"
      >
        <Image rounded="md" w="150px" src={stonk.url} />
      </Flex>
      <Flex direction="column">
        <Text mb={2} textAlign="center" fontWeight="bold">
          {stonk.name}
        </Text>
        <Text mb={2} textAlign="center">
          Marketcap - {stonk.marketcap} GBP
        </Text>
        <Text mb={2} textAlign="center">
          Price - {stonk.price} GBP
        </Text>
        <Text mb={2} textAlign="center">
          Post Count - {stonk.numPosts}
        </Text>
        {stonk.position ? (
          <Text textAlign="center">Your Position - {stonk.position}</Text>
        ) : null}
      </Flex>
      <Flex justifyContent="center" align="center">
        <Flex direction="column">
          <BuyButton
            currentPosition={stonk.position}
            name={stonk.name}
            price={stonk.price}
          />
          <SellButton
            currentPosition={stonk.position}
            name={stonk.name}
            price={stonk.price}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
