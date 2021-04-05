import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Flex,
  FlexProps,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRankingQuery } from "src/generated/graphql";
import { BUCKET_BASE_URL } from "src/utils/constants";

const idx_tf: Record<number, string> = {
  0: "day",
  1: "week",
  2: "month",
  3: "ever",
};

const mod = Object.keys(idx_tf).length;

interface LeaderboardsProps extends FlexProps {}

export const Leaderboards: React.FC<LeaderboardsProps> = (flexProps) => {
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
        timeFrame={idx_tf[index]}
        {...flexProps}
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

interface LeaderboardProps extends FlexProps {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  timeFrame: string;
  setUserCalled: React.Dispatch<React.SetStateAction<boolean>>;
}

const Leaderboard: React.FC<LeaderboardProps> = (props) => {
  const { index, setIndex, setUserCalled, timeFrame, ...flexProps } = props;
  const [isMhp, setIsMhp] = useState(true);
  useEffect(() => {
    if (!index) setIsMhp(!isMhp);
  }, [index]);
  const [{ data, error, fetching }] = useRankingQuery({
    variables: { timeFrame, skip: 0, take: 3, isMhp },
  });
  const router = useRouter();
  if (error) console.log(error);
  if (fetching || !data?.ranking?.items || data.ranking.items.length === 0)
    return <Flex h="40vh"></Flex>;
  const ranks = data.ranking?.items;
  let titles: Record<string, string> = {
    day: "Daily",
    week: "Weekly",
    month: "Month",
    ever: "Ever",
  };
  const title = titles[timeFrame];
  return (
    <Flex p={2} direction="column" {...flexProps}>
      <Text textAlign="center" fontSize="20px">
        Leaderboards
      </Text>
      <Flex justifyContent="space-between">
        <Flex ml={6} alignItems="center">
          <ChevronLeftIcon
            _hover={{ cursor: "pointer" }}
            onClick={() => {
              setIndex((index + mod - 1) % mod);
              setUserCalled(true);
            }}
            size="15px"
          />
          <Text>{title}</Text>
          <ChevronRightIcon
            _hover={{ cursor: "pointer" }}
            onClick={() => {
              setIndex((index + 1) % mod);
              setUserCalled(true);
            }}
            size="15px"
          />
        </Flex>
        <Text mr={4} fontSize="20px">
          {isMhp ? "MHP" : "GBP"}
        </Text>
      </Flex>
      <Table>
        <Thead>
          <Tr>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {ranks.map((rank) => (
            <Tr
              key={rank.user.id}
              _hover={{ backgroundColor: "gray.800", cursor: "pointer" }}
              onClick={() => router.push(`/user/${rank.user.id}`)}
            >
              <Td>
                <Flex alignItems="center">
                  <Avatar
                    border="1px solid white"
                    size="sm"
                    src={rank.user.avatar}
                  />
                  <Text ml={2}>{rank.user.username}</Text>
                </Flex>
              </Td>
              <Td>
                <Text textAlign="center">{isMhp ? rank.mhp : rank.gbp}</Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Button roundedTop={0} onClick={() => router.push("/user/rankings")}>
        <Image height="25px" src={BUCKET_BASE_URL + "/icons/rank.png"} />
        <Text ml={4}>View Rankings</Text>
      </Button>
    </Flex>
  );
};
