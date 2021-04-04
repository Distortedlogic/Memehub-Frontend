import { Flex, Text } from "@chakra-ui/layout";
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/table";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { endMessage } from "src/components/utils/endMessage";
import { loader } from "src/components/utils/loader";
import { useRankingQuery, UserRankFragment } from "src/generated/graphql";
import { AvatarLink } from "../utils/AvatarLink";

const take = 16;
interface RankingProps {
  timeFrame: string;
  isMhp: boolean;
}

export const Ranking: React.FC<RankingProps> = ({ timeFrame, isMhp }) => {
  const [skip, setSkip] = useState(0);
  const loadMore = () => setSkip(skip + take);
  const [{ data, error, fetching }] = useRankingQuery({
    variables: {
      skip,
      take,
      timeFrame,
      isMhp,
    },
  });
  useEffect(() => setSkip(0), [timeFrame]);
  if (error) console.log("error", error);
  if (fetching || !data?.ranking) return <></>;
  const { items: ranks, hasMore } = data.ranking;
  return (
    <Flex justifyContent="center" w="100%">
      <InfiniteScroll
        dataLength={ranks.length}
        next={loadMore}
        hasMore={hasMore}
        loader={loader}
        endMessage={endMessage}
      >
        <Table variant="simple">
          <TableCaption placement="top">{isMhp ? "MHP" : "GBP"}</TableCaption>
          <Thead>
            <Tr>
              <Th>Rank</Th>
              <Th>User</Th>
              <Th isNumeric>{isMhp ? "MHP" : "GBP"}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {ranks.map((rank) => (
              <Tr key={rank.user.id}>
                <Td>{rank.mhpRank}</Td>
                <Td>
                  <Flex justifyContent="start" alignItems="center">
                    <AvatarLink
                      size="sm"
                      userId={rank.user.id}
                      src={rank.user.avatar}
                    />
                    <Text ml={4} color="white">
                      {rank.user.username}
                    </Text>
                  </Flex>
                </Td>
                <Td isNumeric>{isMhp ? rank.mhp : rank.gbp}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </InfiniteScroll>
    </Flex>
  );
};
interface RankProps {
  rank: UserRankFragment;
}

const Rank: React.FC<RankProps> = ({ rank }) => {
  <Tr>
    <Td>{rank.mhpRank}</Td>
    <Td>
      <Flex justifyContent="space-between" alignItems="center">
        <Text mr={4} color="white">
          {rank.mhpRank}
        </Text>
        <AvatarLink size="sm" userId={rank.user.id} src={rank.user.avatar} />
        <Text ml={4} color="white">
          {rank.user.username}
        </Text>
      </Flex>
    </Td>
    <Td isNumeric>{rank.mhp}</Td>
  </Tr>;
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      key={rank.user.id}
      backgroundColor="black"
      rounded="md"
      p={4}
      mb={2}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Text mr={4} color="white">
          {rank.mhpRank}
        </Text>
        <AvatarLink size="sm" userId={rank.user.id} src={rank.user.avatar} />
        <Text ml={4} color="white">
          {rank.user.username}
        </Text>
      </Flex>
      <Text mr={4} color="white" fontWeight="bold">
        {rank.mhp}
      </Text>
    </Flex>
  );
};
