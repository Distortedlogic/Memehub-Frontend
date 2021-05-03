import { Button } from "@chakra-ui/button";
import { Flex, FlexProps, Text } from "@chakra-ui/layout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ellipsize from "ellipsize";
import React, { useState } from "react";
import { MemeModal } from "src/components/meme/MemeModal";
import { InvestmentFragment, RedditMemeFragment } from "src/generated/graphql";
import { InvestButton } from "./utils/InvestButton";
import { ShortButton } from "./utils/ShortButton";
dayjs.extend(relativeTime);

interface BlogViewProps extends FlexProps {
  meme: RedditMemeFragment;
}

export const BlogView: React.FC<BlogViewProps> = (props) => {
  let { meme, ...flexProps } = props;
  const [investmentData, setInvestmentData] = useState<
    InvestmentFragment | undefined | null
  >(meme.investment);
  return (
    <Flex direction="column" p={6} {...flexProps}>
      <Flex mb={4} justifyContent="space-between">
        <Text mx={2} textOverflow="ellipsis">
          {ellipsize(meme.title, 20)}
        </Text>
      </Flex>
      <Flex
        _hover={{ cursor: "pointer" }}
        justifyContent="center"
        alignItems="center"
        p={2}
      >
        <MemeModal rounded="md" w="auto" url={meme.url} />
      </Flex>
      {investmentData ? (
        <Flex mt={2} justifyContent="center" alignitems="center">
          {investmentData.type === "short" ? (
            <ShortButton
              investmentData={investmentData}
              setInvestmentData={setInvestmentData}
              mr={1}
              size="sm"
              meme={meme}
            />
          ) : null}
          {investmentData.type === "invest" ? (
            <InvestButton
              investmentData={investmentData}
              setInvestmentData={setInvestmentData}
              mr={1}
              size="sm"
              meme={meme}
            />
          ) : null}
          <Button size="sm">
            <Flex justifyContent="center" alignItems="center">
              <Text
                color={investmentData.profitLoss < 0 ? "red.500" : "green.500"}
              >
                {investmentData.profitLoss < 0
                  ? investmentData.profitLoss
                  : `+${investmentData.profitLoss}`}
              </Text>
              <Text ml={1}>GBP</Text>
            </Flex>
          </Button>
        </Flex>
      ) : (
        <Flex mt={2} justifyContent="center" alignitems="center">
          <ShortButton
            investmentData={investmentData}
            setInvestmentData={setInvestmentData}
            mr={1}
            size="sm"
            meme={meme}
          />
          <InvestButton
            investmentData={investmentData}
            setInvestmentData={setInvestmentData}
            size="sm"
            meme={meme}
          />
        </Flex>
      )}
    </Flex>
  );
};
