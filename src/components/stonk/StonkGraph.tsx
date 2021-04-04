import { Flex } from "@chakra-ui/layout";
import { ResponsiveLine } from "@nivo/line";
import React from "react";
import { useMarketHistoryQuery } from "src/generated/graphql";
interface StonkGraphProps {
  name: string;
  isMarketcap: boolean;
  minHeight: string;
}

export const StonkGraph: React.FC<StonkGraphProps> = ({
  isMarketcap,
  name,
  minHeight,
}) => {
  const [{ fetching, data, error }] = useMarketHistoryQuery({
    variables: { take: 10, name },
  });
  if (error) console.log(error);
  if (fetching || !data?.marketHistory)
    return <Flex minHeight={minHeight}></Flex>;
  const { marketHistory } = data;
  const points_days = isMarketcap
    ? marketHistory.map((data) => {
        return {
          y: data.marketcap,
          x: new Date(data.createdAt).getDate(),
        };
      })
    : marketHistory.map((data) => {
        return {
          y: data.price,
          x: new Date(data.createdAt).getDate(),
        };
      });
  const y_vals = isMarketcap
    ? marketHistory.map((data) => data.marketcap)
    : marketHistory.map((data) => data.price);
  const tickValues = [...new Set(points_days.map((item) => item.y))];
  return (
    <ResponsiveLine
      data={[
        {
          id: `${isMarketcap ? "Marketcap" : "Price"}`,
          data: points_days,
        },
      ]}
      theme={{ textColor: "#eee" }}
      margin={{ top: 10, right: 10, bottom: 50, left: 100 }}
      colors={(data: any) => {
        return data.value >= 0 ? "green" : "red";
      }}
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
      yScale={{
        type: "linear",
        min: Math.min.apply(null, y_vals),
        max: Math.max.apply(null, y_vals),
        stacked: false,
        reverse: false,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        tickValues: tickValues.length >= 5 ? 5 : tickValues.length,
        legend: `${isMarketcap ? "Marketcap " : "Price "}`,
        legendPosition: "middle",
        legendOffset: -80,
      }}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  );
};
