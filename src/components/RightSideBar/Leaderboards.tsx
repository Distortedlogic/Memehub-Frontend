import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Avatar, Box, Divider, Flex, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { useRankingQuery, UserRankFragment } from "src/generated/graphql";

const idx_timeframe: Record<number, string> = {
  0: "day",
  1: "week",
  2: "month",
  3: "ever",
};

const mod = Object.keys(idx_timeframe).length;

interface LeaderboardsProps {}

export const Leaderboards: React.FC<LeaderboardsProps> = () => {
  const [index, setIndex] = useState(0);
  const [userCalled, setUserCalled] = useState(false);
  const [leaderboard, setLeaderboard] = useState(<></>);
  let id: any;
  useEffect(() => {
    setLeaderboard(
      <Leaderboard
        index={index}
        setIndex={setIndex}
        setUserCalled={setUserCalled}
        timeFrame={idx_timeframe[index]}
      />
    );
    if (!userCalled) {
      id = setTimeout(() => {
        setIndex((index + 1) % mod);
      }, 1000 * 60);
    } else {
      setUserCalled(false);
    }
    return () => {
      if (id) clearTimeout(id);
    };
  }, [index]);
  return leaderboard;
};

interface LeaderboardProps {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  timeFrame: string;
  setUserCalled: React.Dispatch<React.SetStateAction<boolean>>;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  index,
  setIndex,
  setUserCalled,
  timeFrame,
}) => {
  const [{ data, error, fetching }] = useRankingQuery({
    variables: { timeFrame, skip: 0, take: 3 },
  });
  if (error) console.log(error);
  if (fetching || !data?.ranking?.items || data.ranking.items.length === 0)
    return <></>;
  const ranks = data.ranking?.items;
  let titles: Record<string, string> = {
    day: "Daily",
    week: "Weekly",
    month: "Month",
    ever: "Ever",
  };
  const title = titles[timeFrame];
  return (
    <Box p={2} rounded="md" backgroundColor="black">
      <Stack>
        <Flex mt={2} justifyContent="space-around" alignItems="center">
          <Text ml={4} fontSize="25px" textAlign="center">
            Leaderboards
          </Text>
          <Flex justifyContent="center" alignItems="center">
            <ChevronLeftIcon
              _hover={{ cursor: "pointer" }}
              onClick={() => {
                setIndex((index - 1) % mod);
                setUserCalled(true);
              }}
              size="15px"
            />
            <Text mx={0.5} textAlign="center">
              {title}
            </Text>
            <ChevronRightIcon
              _hover={{ cursor: "pointer" }}
              onClick={() => {
                setIndex((index + 1) % mod);
                setUserCalled(true);
              }}
              size="15px"
            />
          </Flex>
        </Flex>
        <Divider />
        {ranks.map((rank) => (
          <Leader key={rank.user.id} rank={rank} />
        ))}
      </Stack>
    </Box>
  );
};

interface LeaderProps {
  rank: UserRankFragment;
}

const Leader: React.FC<LeaderProps> = ({ rank }) => {
  return (
    <Box key={rank.user.id}>
      <NextLink href={`/user/${rank.user.id}`}>
        <Flex
          _hover={{ backgroundColor: "gray.800", cursor: "pointer" }}
          justifyContent="space-between"
          py={2}
          px={6}
        >
          <Flex alignItems="center">
            <Avatar border="1px solid white" size="sm" src={rank.user.avatar} />
            <Text ml={2}>{rank.user.username}</Text>
          </Flex>
          <Text textAlign="center">{rank.totalPoints}</Text>
        </Flex>
      </NextLink>
      <Divider mt={2} />
    </Box>
  );
};
