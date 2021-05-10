import { Flex } from "@chakra-ui/layout";
import { ResponsiveBar } from "@nivo/bar";
import { withUrqlClient } from "next-urql";
import React from "react";
import { useStonksQuery } from "src/generated/graphql";
import { urqlClient } from "src/urql/urqlClient";
import { do_binning } from "src/utils/functions";
import DoubleColLayout from "../_doubleColLayout";

interface statsProps {}

const stats: React.FC<statsProps> = () => {
  const [{ data, fetching, error }] = useStonksQuery();
  if (error) console.log(error);
  if (fetching || error || !data?.stonks) return <></>;
  const isMarketcap = true;
  const bins = do_binning(data.stonks.items, isMarketcap);
  const tickValues = [...new Set(bins.map((item) => item.count))];
  return (
    <DoubleColLayout>
      <Flex h="150px" w="45%" mx={2}>
        <ResponsiveBar
          data={bins}
          keys={["count"]}
          indexBy="maxNum"
          theme={{ textColor: "#eee" }}
          margin={{ top: 10, right: 10, bottom: 50, left: 50 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          colors={(data: any) => {
            return data.value >= 0 ? "green" : "red";
          }}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Past Week",
            legendPosition: "middle",
            legendOffset: 32,
          }}
          gridYValues={tickValues.length >= 5 ? 5 : tickValues.length}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            tickValues: tickValues.length >= 5 ? 5 : tickValues.length,
            legend: `${isMarketcap ? "Marketcap " : "Price "}`,
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </Flex>
    </DoubleColLayout>
  );
};
export default withUrqlClient(urqlClient)(stats);
