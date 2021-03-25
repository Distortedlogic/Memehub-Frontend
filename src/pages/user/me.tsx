import {
  Avatar,
  Badge,
  Divider,
  Flex,
  Grid,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ResponsiveBar } from "@nivo/bar";
import { withUrqlClient } from "next-urql";
import React from "react";
import { HiveTicker } from "src/components/RightSideBar/HiveTicker";
import { Leaderboards } from "src/components/RightSideBar/Leaderboards";
import {
  useCurrentRanksQuery,
  useLogoutMutation,
  useMyProfileQuery,
  UserFragment,
  useUserRanksQuery,
} from "src/generated/graphql";
import { urqlClient } from "src/urql/urqlClient";
import { BUCKET_BASE_URL } from "src/utils/constants";
import { SingleColLayout } from "../_singleColLayout";

interface meProps {}

const me: React.FC<meProps> = () => {
  const [, logoutFN] = useLogoutMutation();
  const [{ data, error, fetching }] = useMyProfileQuery();
  if (error) {
    console.log("error", error);
  }
  if (fetching || !data?.me) {
    return <></>;
  }
  return (
    <SingleColLayout>
      <Grid h="100%" w="100%" templateColumns="2fr 1fr">
        <Flex direction="column">
          <Flex m={2} p={2} justify="space-between">
            <Text>Profile</Text>
            <Image
              _hover={{ cursor: "pointer" }}
              onClick={() => logoutFN()}
              height="20px"
              src={BUCKET_BASE_URL + "/icons/logout.png"}
            />
          </Flex>
          <Flex justifyContent="center">
            <Divider w="95%" />
          </Flex>
          <Flex py={2} direction="column" alignItems="center">
            <Flex
              mr={4}
              my={2}
              justifyContent="centerr"
              alignItems="center"
              direction="column"
            >
              <Avatar src={data.me.avatar} size="xl" />
              <Text textAlign="center" py={2} fontWeight="bold" fontSize="20px">
                {data.me.username}
              </Text>
            </Flex>
            <RankScoreTable user={data.me} />
          </Flex>
        </Flex>
        <Flex direction="column">
          <HiveTicker />
          <Leaderboards />
        </Flex>
      </Grid>
    </SingleColLayout>
  );
};

interface RankScoreTableProps {
  user: UserFragment;
}

const RankScoreTable: React.FC<RankScoreTableProps> = ({ user }) => {
  const [{ fetching, error, data }] = useCurrentRanksQuery({
    variables: { userId: user.id },
  });
  if (error) console.log(error);
  if (fetching || !data) return <></>;
  const extractRank = (timeFrame: string) =>
    data?.currentRanks.filter((rank) => rank.timeFrame === timeFrame)[0].rank;
  const extractScore = (timeFrame: string) =>
    data?.currentRanks.filter((rank) => rank.timeFrame === timeFrame)[0]
      .totalPoints;
  return (
    <Flex w="100%" pl={4} justifyContent="space-around">
      <Flex>
        <Stack mr={4}>
          <Badge textAlign="center">Rank</Badge>
          <Badge textAlign="center">Ever: {extractRank("ever")}</Badge>
          <Badge textAlign="center">Month: {extractRank("month")}</Badge>
          <Badge textAlign="center">Week: {extractRank("week")}</Badge>
          <Badge textAlign="center">Day: {extractRank("day")}</Badge>
        </Stack>
        <Stack mr={4}>
          <Badge textAlign="center">Score</Badge>
          <Badge textAlign="center">Ever: {extractScore("ever")}</Badge>
          <Badge textAlign="center">Month: {extractScore("month")}</Badge>
          <Badge textAlign="center">Week: {extractScore("week")}</Badge>
          <Badge textAlign="center">Day: {extractScore("day")}</Badge>
        </Stack>
      </Flex>

      <WeeklyPL userId={user.id} />
    </Flex>
  );
};

interface weeklyPLProps {
  userId: string;
}

const WeeklyPL: React.FC<weeklyPLProps> = ({ userId }) => {
  const [{ fetching, data, error }] = useUserRanksQuery({
    variables: { num: 8, userId, timeFrame: "ever" },
  });
  if (error) console.log(error);
  if (fetching || !data) return <></>;
  const { userRanks } = data;
  const points_days = Array.from(Array(userRanks.length - 1).keys()).map(
    (idx) => {
      return {
        points: userRanks[idx + 1].totalPoints - userRanks[idx].totalPoints,
        day: new Date(userRanks[idx + 1].createdAt).getDate(),
      };
    }
  );
  const tickValues = [...new Set(points_days.map((item) => item.points))];
  return (
    <ResponsiveBar
      data={points_days}
      keys={["points"]}
      indexBy="day"
      theme={{ textColor: "#eee" }}
      margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
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
        legend: "Score Gain/Loss",
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
  );
};

export default withUrqlClient(urqlClient)(me);
