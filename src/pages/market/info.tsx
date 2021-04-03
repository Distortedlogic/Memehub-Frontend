import { Image } from "@chakra-ui/image";
import { Flex, Text } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import React from "react";
import { urqlClient } from "src/urql/urqlClient";
import { BUCKET_BASE_URL } from "src/utils/constants";
import { DoubleColLayout } from "../_doubleColLayout";

interface InfoProps {}

const Info: React.FC<InfoProps> = () => {
  return (
    <DoubleColLayout>
      <Flex py={4} w="100%" h="100%" justifyContent="center">
        <Flex justifyContent="space-between" w="100%">
          <Flex w="100%" justifyContent="center" alignItems="center">
            <Image src={`${BUCKET_BASE_URL}/marketing/redditorCollage.png`} />
          </Flex>
          <Flex
            w="100%"
            direction="column"
            justifyContent="center"
            alignItems="center"
            px={8}
          >
            <Text mb={2} textAlign="center" fontSize="xl" fontWeight="bold">
              So what is the Stonk Market?
            </Text>
            <Text>
              After scrapping wild memes off the internet, running them through
              our dank AI computer vision system, then doing a little math
              magic, Memehub is available to price over 400 popular meme
              templates based off real world meme data. Effectively creating a
              mock stock market of meme templates!
            </Text>
            <Text mt={6}>
              Prices is correlated to upvotes per post, while Marketcap is
              correlated to upvotes from all posts. This is over a specified
              aggregation period.
            </Text>
            <Text mt={6}>
              The Stonk Market updates daily at midnight UTC, the current
              aggregation persion is one month, and memes are scraped from
              Reddit r/memes and r/dankmemes.
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DoubleColLayout>
  );
};
export default withUrqlClient(urqlClient)(Info);
