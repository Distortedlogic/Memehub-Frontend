import { ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useMeQuery } from "src/generated/graphql";
import { BUCKET_BASE_URL } from "src/utils/constants";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const router = useRouter();
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      w="100%"
      h="100%"
      px={4}
    >
      <Flex justifyContent="center" alignContent="center">
        <NextLink href="/">
          <Link>
            <Image
              src={`${BUCKET_BASE_URL}/icons/memehub.png`}
              my={2}
              h="35px"
            />
          </Link>
        </NextLink>
      </Flex>
      <Flex>
        <InputGroup>
          <Input
            border="none"
            rounded="none"
            borderBottom="1px solid gray"
            placeholder="search..."
          />
          <InputRightElement pointerEvents="none" children={<Search2Icon />} />
        </InputGroup>
      </Flex>
      <Flex justifyContent="center" alignItems="center">
        <Link
          _focus={{}}
          _hover={{ cursor: "pointer" }}
          href="https://peakd.com/c/hive-189111/created"
          target="_blank"
          mr={8}
        >
          <Tooltip hasArrow label="Hive Community">
            <Image height="25px" src={BUCKET_BASE_URL + "/icons/hive.png"} />
          </Tooltip>
        </Link>
        <Link
          _focus={{}}
          _hover={{ cursor: "pointer" }}
          href="https://discord.gg/QAcbE7Y"
          target="_blank"
          mr={8}
        >
          <Tooltip hasArrow label="Discord Server">
            <Image height="30px" src={BUCKET_BASE_URL + "/icons/discord.png"} />
          </Tooltip>
        </Link>
        <Link
          _focus={{}}
          _hover={{ cursor: "pointer" }}
          href="https://imgflip.com/memegenerator"
          target="_blank"
          mr={8}
        >
          <Tooltip hasArrow label="Create A Meme">
            <Image
              height="25px"
              src={BUCKET_BASE_URL + "/icons/makeMeme.png"}
            />
          </Tooltip>
        </Link>
        <Tooltip hasArrow label="Upload A Meme">
          <Image
            _hover={{ cursor: "pointer" }}
            onClick={() => router.push("/upload")}
            height="30px"
            src={BUCKET_BASE_URL + "/icons/rocket.png"}
            mr={8}
          />
        </Tooltip>
        <Login />
      </Flex>
    </Flex>
  );
};

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const router = useRouter();
  const [{ data, error, fetching }] = useMeQuery();
  if (error) console.log(error);
  if (fetching || error) return <Button>Login</Button>;
  if (!data?.me) return <LoginButton />;
  else
    return (
      <Popover>
        <PopoverTrigger>
          <Flex
            _hover={{ cursor: "pointer" }}
            justifyContent="center"
            alignItems="center"
          >
            <Avatar size="sm" src={data.me.avatar} />
            <Text ml={2}>{data.me.username}</Text>
            <ChevronDownIcon ml={2} />
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
              onClick={() => router.push("/user/me")}
            >
              <Image
                height="25px"
                src={BUCKET_BASE_URL + "/icons/person.png"}
              />
              <Text ml={4}>Profile</Text>
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
              onClick={() => router.push("/wallet")}
            >
              <Image
                height="25px"
                src={BUCKET_BASE_URL + "/icons/wallet.png"}
              />
              <Text ml={4}>Wallet</Text>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
};

interface LoginButtonProps {}
const LoginButton: React.FC<LoginButtonProps> = () => {
  const router = useRouter();
  return (
    <Button onClick={() => router.push("/onboarding/hiveLogin")}>
      <Image h="15px" mr={3} src={`${BUCKET_BASE_URL}/icons/person.png`} />
      Login
    </Button>
  );
};
