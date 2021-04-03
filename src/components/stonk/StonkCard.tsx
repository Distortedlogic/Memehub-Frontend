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
        <Text mb={2} fontWeight="bold">
          {stonk.name}
        </Text>
        <Text mb={2} textAlign="center">
          Marketcap - {stonk.marketcap} GBP
        </Text>
        <Text mb={2} textAlign="center">
          Price - {stonk.price} GBP
        </Text>
        <Text textAlign="center">Post Count - {stonk.numPosts}</Text>
        <Text textAlign="center">Your Position - {stonk.position}</Text>
      </Flex>

      <BottomBar stonk={stonk} />
    </Flex>
  );
};

interface BottomBarProps {
  stonk: StonkFragment;
}

export const BottomBar: React.FC<BottomBarProps> = ({ stonk }) => {
  return (
    <Flex justifyContent="center" align="center">
      <Flex direction="column">
        <BuyButton name={stonk.name} price={stonk.price} />
        <SellButton name={stonk.name} price={stonk.price} />
      </Flex>
    </Flex>
  );
};
