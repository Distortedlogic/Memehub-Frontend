import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useStoreActions } from "src/store/store";
import { BUCKET_BASE_URL } from "src/utils/constants";

interface MiniNavBarProps {}

export const MiniNavBar: React.FC<MiniNavBarProps> = () => {
  const router = useRouter();
  const {
    settings: { setGridView },
  } = useStoreActions((actions) => actions);
  return (
    <Flex
      alignItems="center"
      justifyContent="space-around"
      w="100%"
      h="100%"
      px={4}
    >
      <Flex>
        <Popover>
          <PopoverTrigger>
            <Flex
              _hover={{ cursor: "pointer" }}
              justifyContent="space-between"
              alignItems="center"
              mr={12}
            >
              <Image height="25px" src={BUCKET_BASE_URL + "/icons/top.png"} />
              <Text mx={2}>Top</Text>
              <ChevronDownIcon />
            </Flex>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody rounded="md" backgroundColor="black" size="sm" p={0}>
              <Flex
                _hover={{
                  cursor: "pointer",
                  backgroundColor: "gray.800",
                  roundedTop: "md",
                }}
                p={2}
                justifyContent="center"
                alignItems="center"
                onClick={() => router.push("/top/daily")}
              >
                <Image
                  height="25px"
                  src={BUCKET_BASE_URL + "/icons/daily.png"}
                />
                <Text ml={4}>Daily</Text>
              </Flex>
              <Flex
                _hover={{
                  cursor: "pointer",
                  backgroundColor: "gray.800",
                  roundedTop: "md",
                }}
                p={2}
                justifyContent="center"
                alignItems="center"
                onClick={() => router.push("/top/weekly")}
              >
                <Image
                  height="25px"
                  src={BUCKET_BASE_URL + "/icons/weekly.png"}
                />
                <Text ml={4}>Weekly</Text>
              </Flex>
              <Flex
                _hover={{
                  cursor: "pointer",
                  backgroundColor: "gray.800",
                  roundedTop: "md",
                }}
                p={2}
                justifyContent="center"
                alignItems="center"
                onClick={() => router.push("/top/monthly")}
              >
                <Image
                  height="25px"
                  src={BUCKET_BASE_URL + "/icons/monthly.png"}
                />
                <Text ml={4}>Monthly</Text>
              </Flex>
              <Flex
                _hover={{
                  cursor: "pointer",
                  backgroundColor: "gray.800",
                  roundedTop: "md",
                }}
                p={2}
                justifyContent="center"
                alignItems="center"
                onClick={() => router.push("/top/ever")}
              >
                <Image
                  height="25px"
                  src={BUCKET_BASE_URL + "/icons/ever.png"}
                />
                <Text ml={4}>Ever</Text>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Flex
          _hover={{ cursor: "pointer" }}
          justifyContent="space-between"
          alignItems="center"
          onClick={() => router.push("/new")}
          mr={12}
        >
          <Image height="25px" src={BUCKET_BASE_URL + "/icons/newspaper.png"} />
          <Text mx={2}>New</Text>
        </Flex>
        <Flex
          _hover={{ cursor: "pointer" }}
          justifyContent="space-between"
          alignItems="center"
          mr={12}
          onClick={() => router.push("/hot")}
        >
          <Image height="25px" src={BUCKET_BASE_URL + "/icons/flame.png"} />
          <Text mx={2}>Hot</Text>
        </Flex>
        <Flex
          _hover={{ cursor: "pointer" }}
          justifyContent="space-between"
          alignItems="center"
          mr={12}
          onClick={() => router.push("/market/stonks")}
        >
          <Image
            height="25px"
            src={BUCKET_BASE_URL + "/icons/stonkMarket.png"}
          />
          <Text mx={2}>Stonks</Text>
        </Flex>
      </Flex>
      <Flex>
        <Flex
          _hover={{ cursor: "pointer" }}
          justifyContent="center"
          alignItems="center"
          onClick={() => setGridView("list")}
          mr={3}
        >
          <Tooltip hasArrow label="list">
            <Image height="15px" src={BUCKET_BASE_URL + "/icons/3dotrow.png"} />
          </Tooltip>
        </Flex>
        <Flex
          _hover={{ cursor: "pointer" }}
          justifyContent="center"
          alignItems="center"
          onClick={() => setGridView("blog")}
          mr={3}
        >
          <Tooltip hasArrow label="blog">
            <Image height="15px" src={BUCKET_BASE_URL + "/icons/3row.png"} />
          </Tooltip>
        </Flex>
        <Flex
          _hover={{ cursor: "pointer" }}
          justifyContent="center"
          alignItems="center"
          onClick={() => setGridView("grid")}
        >
          <Tooltip hasArrow label="Grid">
            <Image height="15px" src={BUCKET_BASE_URL + "/icons/3x3box.png"} />
          </Tooltip>
        </Flex>
      </Flex>
    </Flex>
  );
};
