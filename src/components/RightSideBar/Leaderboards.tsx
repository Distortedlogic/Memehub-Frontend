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
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useInvestmentStatsQuery } from "src/generated/graphql";
import { BUCKET_BASE_URL } from "src/utils/constants";

const idx_tf: Record<number, string[]> = {
  0: ["day", "Daily"],
  1: ["week", "Weekly"],
  2: ["season", "Season"],
  3: ["bestTrade", "Best Trade"],
  4: ["largestYolo", "Largest Yolo"],
};

const mod = Object.keys(idx_tf).length;

interface LeaderboardsProps extends FlexProps {}

export const Leaderboards: React.FC<LeaderboardsProps> = (flexProps) => {
  const [index, setIndex] = useState(0);
  const [userCalled, setUserCalled] = useState(false);
  const [leaderboard, setLeaderboard] = useState(<></>);
  const [{ data, fetching, error }] = useInvestmentStatsQuery();
  if (error) console.log(error);
  if (fetching || error || !data) {
  }
  console.log("data", data);
  let id: any;
  useEffect(() => {
    setLeaderboard(
      <Leaderboard
        index={index}
        setIndex={setIndex}
        setUserCalled={setUserCalled}
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
  setUserCalled: React.Dispatch<React.SetStateAction<boolean>>;
}

const Leaderboard: React.FC<LeaderboardProps> = (props) => {
  const { index, setIndex, setUserCalled, ...flexProps } = props;
  const [_, title] = idx_tf[index];
  const router = useRouter();
  if (false) return <Flex h="40vh"></Flex>;
  return (
    <Flex p={2} maxWidth="100%" direction="column" {...flexProps}>
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
          GBP
        </Text>
      </Flex>
      <Table>
        <Thead>
          <Tr>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <MhpRanking index={index} />
      </Table>
      <Button roundedTop={0} onClick={() => router.push("/user/rankings")}>
        <Image height="25px" src={BUCKET_BASE_URL + "/icons/rank.png"} />
        <Text ml={4}>View Rankings</Text>
      </Button>
    </Flex>
  );
};

interface MhpRankingProps {
  index: number;
}

export const MhpRanking: React.FC<MhpRankingProps> = () => {
  if (false) return <Flex h="40vh"></Flex>;
  return (
    <Tbody>
      <Tr _hover={{ backgroundColor: "gray.800", cursor: "pointer" }}>
        <Td>
          <Flex alignItems="center">
            <Avatar border="1px solid white" size="sm" />
            <Text ml={2}></Text>
          </Flex>
        </Td>
        <Td>
          <Tooltip label={``}>
            <Text textAlign="center"></Text>
          </Tooltip>
        </Td>
      </Tr>
    </Tbody>
  );
};
