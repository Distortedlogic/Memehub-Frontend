import {
  Table,
  TableCaption,
  TableProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/table";
import React from "react";
import { usePositionsQuery } from "../../generated/graphql";
import { SellButton } from "../stonk/SellButton";

interface PositionsProps extends TableProps {
  userId: string;
}

export const Positions: React.FC<PositionsProps> = (props) => {
  const { userId, ...tableprops } = props;
  const [{ data, fetching, error }] = usePositionsQuery({
    variables: { skip: 0, take: 5, userId },
  });
  if (error) console.log(error);
  if (fetching || error || !data) return <></>;
  const { hasMore, items: positions } = data.positions;
  return (
    <Table {...tableprops} w="95%" variant="simple">
      <TableCaption placement="top">Stonk Portfolio</TableCaption>
      <Thead>
        <Tr>
          <Th>Exit</Th>
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
            <Td>
              <SellButton name={position.name} price={position.currentPrice} />
            </Td>
            <Td>{position.name}</Td>
            <Td isNumeric>{position.position}</Td>
            <Td isNumeric>{position.price}</Td>
            <Td isNumeric>{position.currentPrice}</Td>
            <Td isNumeric>{position.currentPrice - position.price}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
