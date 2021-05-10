import { Flex, FlexProps } from "@chakra-ui/layout";
import React from "react";

interface PortfolioProps extends FlexProps {
  userId: string;
}

export const Portfolio: React.FC<PortfolioProps> = (props) => {
  const { userId, ...flexProps } = props;
  return <Flex minHeight="80vh" direction="column" {...flexProps}></Flex>;
};
