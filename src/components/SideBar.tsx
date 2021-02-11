import { Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { BUCKET_BASE_URL } from "src/utils/constants";

interface SideBarProps {}
const StackItem: React.FC<any> = (props) => (
  <Flex
    _hover={{ cursor: "pointer", backgroundColor: "gray.800" }}
    justifyContent="start"
    alignItems="center"
    w="100%"
    py={3}
    pl={8}
    {...props}
  />
);
export const SideBar: React.FC<SideBarProps> = () => {
  return (
    <Flex
      direction="column"
      justifyContent="start"
      alignContent="start"
      w="100%"
      h="100%"
      overflow="auto"
    >
      <StackItem>
        <Image height="25px" src={BUCKET_BASE_URL + "/icons/rocket.png"} />
        <Text ml={4}>Upload Meme</Text>
      </StackItem>
      <StackItem>
        <Flex>
          <Image height="25px" src={BUCKET_BASE_URL + "/icons/ever.png"} />
          <Text mx={4}>Top</Text>
        </Flex>
      </StackItem>
      <StackItem>
        <Image height="25px" src={BUCKET_BASE_URL + "/icons/newspaper.png"} />
        <Text ml={4}>New</Text>
      </StackItem>
      <StackItem>
        <Image height="25px" src={BUCKET_BASE_URL + "/icons/flame.png"} />
        <Text ml={4}>Hot</Text>
      </StackItem>
      <StackItem>
        <Flex>
          <Image height="25px" src={BUCKET_BASE_URL + "/icons/chamber.png"} />
          <Text ml={4}>Chambers</Text>
        </Flex>
      </StackItem>
      <StackItem>
        <Image height="25px" src={BUCKET_BASE_URL + "/icons/rank.png"} />
        <Text ml={4}>Rank</Text>
      </StackItem>
      <StackItem>
        <Flex>
          <Image height="25px" src={BUCKET_BASE_URL + "/icons/nn.png"} />
          <Text ml={4}>AI</Text>
        </Flex>
      </StackItem>
      <StackItem>
        <Flex>
          <Image height="25px" src={BUCKET_BASE_URL + "/icons/reddit.png"} />
          <Text ml={4}>Reddit Data</Text>
        </Flex>
      </StackItem>
      <StackItem>
        <Flex>
          <Image height="25px" src={BUCKET_BASE_URL + "/icons/info.png"} />
          <Text ml={4}>Info</Text>
        </Flex>
      </StackItem>
    </Flex>
  );
};
