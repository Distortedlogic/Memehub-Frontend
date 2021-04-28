import { Image } from "@chakra-ui/image";
import { Flex, FlexProps, Text } from "@chakra-ui/layout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ellipsize from "ellipsize";
import React from "react";
import { RedditMemeFragment } from "src/generated/graphql";
import { InvestButton } from "./utils/InvestButton";
import { ShortButton } from "./utils/ShortButton";
dayjs.extend(relativeTime);

interface ListViewProps extends FlexProps {
  meme: RedditMemeFragment;
}

export const ListView: React.FC<ListViewProps> = (props) => {
  let { meme, ...flewProps } = props;
  return (
    <Flex w="100%" direction="column" {...flewProps}>
      <Flex justifyContent="space-between" alignItems="center" p={4}>
        <Flex alignItems="center" direction="column">
          <Flex
            _hover={{ cursor: "pointer" }}
            justifyContent="center"
            alignItems="center"
          >
            <Image rounded="md" w="150px" src={meme.url} />
          </Flex>
        </Flex>
        <Flex w="100%" px={4}>
          <Text mr={4} textAlign="center">
            {ellipsize(meme.title, 20)}
          </Text>
        </Flex>
        <Flex justifyContent="center" align="center">
          <Flex direction="column">
            <InvestButton m={1} size="sm" meme={meme} />
            <ShortButton m={1} size="sm" meme={meme} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
