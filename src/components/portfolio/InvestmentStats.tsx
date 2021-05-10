import { Button } from "@chakra-ui/button";
import { Flex, SimpleGrid } from "@chakra-ui/layout";
import React from "react";
import { useUserInvestmentStatsQuery } from "src/generated/graphql";

interface InvestmentStatsProps {
  userId: string;
  timeframe: string;
  setTimeframe: React.Dispatch<React.SetStateAction<string>>;
  typeFilter: string;
  season: number;
}

export const InvestmentStats: React.FC<InvestmentStatsProps> = (props) => {
  const {
    userId,
    season,
    typeFilter,
    timeframe,
    setTimeframe,
    ...flexProps
  } = props;
  const [{ data, fetching, error }] = useUserInvestmentStatsQuery({
    variables: { timeframe, userId, typeFilter, season },
  });
  if (error) console.log(error);
  if (fetching || error || !data) return <></>;
  return (
    <>
      <Flex mb={2} justifyContent="center" {...flexProps}>
        <Button
          isActive={timeframe === "daily"}
          onClick={() => setTimeframe("daily")}
        >
          Daily
        </Button>
        <Button
          ml={2}
          isActive={timeframe === "weekly"}
          onClick={() => setTimeframe("weekly")}
        >
          Weekly
        </Button>
        <Button
          ml={2}
          isActive={timeframe === "season"}
          onClick={() => setTimeframe("season")}
        >
          Season
        </Button>
      </Flex>
      <SimpleGrid px={4} minChildWidth="250px" spacing={2} {...flexProps}>
        <Button size="sm">{`Best Trade: ${data.userInvestmentStats?.bestTrade} GBP`}</Button>
        <Button size="sm">{`Worst Trade: ${data.userInvestmentStats?.worstTrade} GBP`}</Button>
        <Button size="sm">{`Profit/Loss: ${data.userInvestmentStats?.profitLoss} GBP`}</Button>
        <Button size="sm">{`Total Number of Trades: ${data.userInvestmentStats?.numTrades}`}</Button>
        <Button size="sm">{`Number of Good Trades: ${data.userInvestmentStats?.numGoodTrades}`}</Button>
        <Button size="sm">{`Good Trade Ratio: ${
          data.userInvestmentStats?.numTrades &&
          data.userInvestmentStats?.numTrades !== 0
            ? (
                data.userInvestmentStats.numGoodTrades /
                data.userInvestmentStats.numTrades
              ).toFixed(2)
            : 0
        }`}</Button>
      </SimpleGrid>
    </>
  );
};
