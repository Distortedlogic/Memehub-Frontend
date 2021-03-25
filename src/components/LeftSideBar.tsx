import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Collapse, Flex, Image, Text, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { BUCKET_BASE_URL } from "src/utils/constants";

interface LeftSideBarProps {}
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
export const LeftSideBar: React.FC<LeftSideBarProps> = () => {
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Flex
      direction="column"
      justifyContent="start"
      alignContent="start"
      w="100%"
    >
      <StackItem onClick={() => router.push("/upload")}>
        <Image height="25px" src={BUCKET_BASE_URL + "/icons/rocket.png"} />
        <Text ml={4}>Upload Meme</Text>
      </StackItem>
      <StackItem justifyContent="space-between" onClick={onToggle}>
        <Flex>
          <Image height="25px" src={BUCKET_BASE_URL + "/icons/top.png"} />
          <Text mx={4}>Top</Text>
        </Flex>
        {isOpen ? <ChevronDownIcon mr={4} /> : <ChevronUpIcon mr={4} />}
      </StackItem>
      <Collapse in={isOpen}>
        <StackItem ml={6} onClick={() => router.push("/top-ratio/ever")}>
          <Flex>
            <Image width="25px" src={BUCKET_BASE_URL + "/icons/ever.png"} />
            <Text mx={4}>Ever</Text>
          </Flex>
        </StackItem>
        <StackItem ml={6} onClick={() => router.push("/top-ratio/monthly")}>
          <Flex>
            <Image height="25px" src={BUCKET_BASE_URL + "/icons/monthly.png"} />
            <Text mx={4}>Monthly</Text>
          </Flex>
        </StackItem>
        <StackItem ml={6} onClick={() => router.push("/top-ratio/weekly")}>
          <Flex>
            <Image height="25px" src={BUCKET_BASE_URL + "/icons/weekly.png"} />
            <Text mx={4}>Weekly</Text>
          </Flex>
        </StackItem>
        <StackItem ml={6} onClick={() => router.push("/top-ratio/daily")}>
          <Flex>
            <Image height="25px" src={BUCKET_BASE_URL + "/icons/daily.png"} />
            <Text mx={4}>Daily</Text>
          </Flex>
        </StackItem>
      </Collapse>
      <StackItem onClick={() => router.push("/new")}>
        <Image height="25px" src={BUCKET_BASE_URL + "/icons/newspaper.png"} />
        <Text ml={4}>New</Text>
      </StackItem>
      <StackItem onClick={() => router.push("/hot")}>
        <Image height="25px" src={BUCKET_BASE_URL + "/icons/flame.png"} />
        <Text ml={4}>Hot</Text>
      </StackItem>
      <StackItem onClick={() => router.push("/wallet")}>
        <Flex>
          <Image height="25px" src={BUCKET_BASE_URL + "/icons/wallet.png"} />
          <Text ml={4}>Wallet</Text>
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
