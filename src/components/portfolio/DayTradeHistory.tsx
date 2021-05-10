import { Flex, FlexProps } from "@chakra-ui/layout";
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useStoreState } from "src/store/store";
import { useUserInvestmentsQuery } from "../../generated/graphql";
import { MemeModal } from "../meme/MemeModal";
import { loader } from "../utils/loader";
import { InvestmentStats } from "./InvestmentStats";
dayjs.extend(relativeTime);

interface TradeHistoryProps extends FlexProps {
  userId: string;
}
const take = 15;
export const DayTradeHistory: React.FC<TradeHistoryProps> = (props) => {
  const { userId, ...flexProps } = props;
  const [skip, setSkip] = useState(0);
  const [order, setOrder] = useState("createdAt");
  const [typeFilter, setTypeFilter] = useState("");
  const [isASC, setIsASC] = useState(false);
  const loadMore = () => setSkip(skip + take);
  const [timeframe, setTimeframe] = useState("daily");
  const {
    settings: { season },
  } = useStoreState((state) => state);
  const [{ data, fetching, error }] = useUserInvestmentsQuery({
    variables: {
      skip,
      take,
      userId,
      order,
      typeFilter,
      timeframe,
      isASC,
      season,
    },
  });
  if (error) console.log(error);
  if (fetching || error || !data?.userInvestments) return <></>;
  const { hasMore, items: investments } = data.userInvestments;
  return (
    <Flex minHeight="80vh" direction="column" {...flexProps}>
      <InvestmentStats
        season={season}
        typeFilter={typeFilter}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        userId={userId}
      />
      <InfiniteScroll
        dataLength={investments.length}
        next={loadMore}
        hasMore={hasMore}
        loader={loader}
        endMessage={<></>}
      >
        <Table variant="simple">
          <TableCaption placement="top">Day Trade History</TableCaption>
          <Thead>
            <Tr>
              <Th>Meme</Th>
              <Th
                _hover={{ color: "gray.500", cursor: "pointer" }}
                onClick={() => {
                  if (order === "createdAt") setIsASC(!isASC);
                  setOrder("createdAt");
                }}
              >
                Created
              </Th>
              <Th
                _hover={{ color: "gray.500", cursor: "pointer" }}
                onClick={() => {
                  if (order === "bestSize") setIsASC(!isASC);
                  setOrder("bestSize");
                }}
                isNumeric
              >
                Best Size
              </Th>
              <Th
                _hover={{ color: "gray.500", cursor: "pointer" }}
                onClick={() => {
                  if (typeFilter === "invest") {
                    setTypeFilter("short");
                  } else if (typeFilter === "short") {
                    setTypeFilter("");
                  } else if (typeFilter === "") {
                    setTypeFilter("invest");
                  }
                }}
              >
                Type
              </Th>
              <Th
                _hover={{ color: "gray.500", cursor: "pointer" }}
                onClick={() => {
                  if (order === "target") setIsASC(!isASC);
                  setOrder("target");
                }}
                isNumeric
              >
                Target
              </Th>
              <Th
                _hover={{ color: "gray.500", cursor: "pointer" }}
                onClick={() => {
                  if (order === "percentile") setIsASC(!isASC);
                  setOrder("percentile");
                }}
                isNumeric
              >
                Percentile
              </Th>
              <Th
                _hover={{ color: "gray.500", cursor: "pointer" }}
                onClick={() => {
                  if (order === "profitLoss") setIsASC(!isASC);
                  setOrder("profitLoss");
                }}
                isNumeric
              >
                P/L
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {investments.map((investment) => (
              <Tr key={investment.id}>
                <Td>
                  <MemeModal h="100px" url={investment.meme.url} />
                </Td>
                <Td>{dayjs(investment.createdAt).fromNow()}</Td>
                <Td isNumeric>{investment.betSize}</Td>
                <Td>{investment.type}</Td>
                <Td isNumeric>
                  {investment.target ? `${investment.target} <=` : "0.50 >"}
                </Td>
                <Td isNumeric>{investment.percentile.toFixed(2)}</Td>
                <Td isNumeric>{investment.profitLoss}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </InfiniteScroll>
    </Flex>
  );
};
