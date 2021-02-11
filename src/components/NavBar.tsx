import { Search2Icon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { BUCKET_BASE_URL } from "src/utils/constants";

export interface NavBarProps {}

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
      <Flex>
        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<Search2Icon />} />
          <Input
            border="none"
            rounded="none"
            borderBottom="1px solid gray"
            placeholder="search..."
          />
        </InputGroup>
      </Flex>
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
      <Button onClick={() => router.push("/login")}>
        <Image h="15px" mr={3} src={`${BUCKET_BASE_URL}/icons/person.png`} />
        Login
      </Button>
    </Flex>
  );
};
