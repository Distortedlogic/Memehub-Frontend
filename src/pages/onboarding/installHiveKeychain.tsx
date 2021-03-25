import { Button } from "@chakra-ui/button";
import { Flex, Link, Text } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import React from "react";
import ReactPlayer from "react-player";
import { urqlClient } from "src/urql/urqlClient";
import { SingleColLayout } from "../_singleColLayout";

interface InstallHiveKeychainProps {}

const InstallHiveKeychain: React.FC<InstallHiveKeychainProps> = () => {
  return (
    <SingleColLayout>
      <Flex p={6} direction="column">
        <Flex flex={1} mb={4} alignContent="center" justifyContent="center">
          <Link
            target="_blank"
            href="https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep?hl=en"
          >
            <Button>Install Hive Keychain Chrome/Brave Extension</Button>
          </Link>
        </Flex>
        <Flex mb={4} justifyContent="center" alignContent="center">
          <Text w="60%" textAlign="center" color="white">
            Hive Keychain is a simple user friendly way to manage and use your
            keys hassle free! It is the method recommended and supported by
            Memehub. After installing via the link above, below is a video to
            assist with importing keys and using hive keychain on peakd.com.
          </Text>
        </Flex>
        <Flex alignContent="center" justifyContent="center">
          <ReactPlayer url="https://youtu.be/9bGtWWVvRZk?t=118" />
        </Flex>
      </Flex>
    </SingleColLayout>
  );
};
export default withUrqlClient(urqlClient)(InstallHiveKeychain);
