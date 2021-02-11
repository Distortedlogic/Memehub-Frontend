import { Flex, FlexProps, useColorMode } from "@chakra-ui/react";

type ContainerProps = {
  children: JSX.Element | (JSX.Element | JSX.Element[])[];
} & FlexProps;

export const Container: React.FC<ContainerProps> = (props) => {
  const { colorMode } = useColorMode();

  const bgColor = { light: "gray.50", dark: "black" };

  const color = { light: "black", dark: "white" };
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      {...props}
    />
  );
};
