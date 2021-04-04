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
import React from "react";
import { useTradeHistoryQuery } from "../../generated/graphql";
dayjs.extend(relativeTime);

interface TradeHistoryProps extends FlexProps {
  userId: string;
}

export const TradeHistory: React.FC<TradeHistoryProps> = (props) => {
  const { userId, ...flexProps } = props;
  const [{ data, fetching, error }] = useTradeHistoryQuery({
    variables: { skip: 0, take: 15, userId },
  });
  if (error) console.log(error);
  if (fetching || error || !data) return <></>;
  const { hasMore, items: positions } = data.history;
  return (
    <Flex border="1px solid white" rounded="md" m={2} {...flexProps}>
      <Table w="95%" variant="simple">
        <TableCaption placement="top">Trade History</TableCaption>
        <Thead>
          <Tr>
            <Th>Created</Th>
            <Th>Name</Th>
            <Th isNumeric>Position</Th>
            <Th isNumeric>Entry Price</Th>
            <Th isNumeric>Current Price</Th>
            <Th isNumeric>P/L</Th>
          </Tr>
        </Thead>
        <Tbody>
          {positions.map((position) => (
            <Tr key={position.name}>
              <Td>{dayjs(position.createdAt).fromNow()}</Td>
              <Td>{position.name}</Td>
              <Td isNumeric>{position.position}</Td>
              <Td isNumeric>{position.price}</Td>
              <Td isNumeric>{position.currentPrice}</Td>
              <Td isNumeric>{position.currentPrice - position.price}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  );
};
