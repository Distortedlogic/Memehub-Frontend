import { Flex } from "@chakra-ui/layout";
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
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePositionsQuery } from "../../generated/graphql";
import { SellButton } from "../stonk/SellButton";
import { loader } from "../utils/loader";

interface PositionsProps extends TableProps {
  userId: string;
}
const take = 16;
export const Positions: React.FC<PositionsProps> = (props) => {
  const { userId, ...flexProps } = props;
  const [skip, setSkip] = useState(0);
  const loadMore = () => setSkip(skip + take);
  const [{ data, fetching, error }] = usePositionsQuery({
    variables: { skip: 0, take, userId },
  });
  if (error) console.log(error);
  if (fetching || error || !data) return <></>;
  const { hasMore, items: positions } = data.positions;
  return (
    <InfiniteScroll
      dataLength={positions.length}
      next={loadMore}
      hasMore={hasMore}
      loader={loader}
      endMessage={<></>}
    >
      <Flex
        justifyContent="center"
        border="1px solid white"
        rounded="md"
        minHeight="25vh"
        m={2}
        {...flexProps}
      >
        <Table variant="simple">
          <TableCaption placement="top">Stonk Portfolio</TableCaption>
          <Thead>
            <Tr>
              <Th textAlign="center">Exit</Th>
              <Th>Name</Th>
              <Th isNumeric>Position</Th>
              <Th isNumeric>Entry Price</Th>
              <Th isNumeric>Current Price</Th>
              <Th isNumeric mr={1}>
                P/L
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {positions.map((position) => (
              <Tr key={position.name}>
                <Td>
                  <Flex justifyContent="center">
                    <SellButton
                      currentPosition={position.position}
                      name={position.name}
                      price={position.currentPrice}
                    />
                  </Flex>
                </Td>
                <Td>{position.name}</Td>
                <Td isNumeric>{position.position}</Td>
                <Td isNumeric>{position.price}</Td>
                <Td isNumeric>{position.currentPrice}</Td>
                <Td isNumeric>
                  {position.position * (position.currentPrice - position.price)}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Flex>
    </InfiniteScroll>
  );
};
