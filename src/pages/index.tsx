import { Flex, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { urqlClient } from "src/urql/urqlClient";
import { BUCKET_BASE_URL } from "src/utils/constants";
import { Layout } from "./_layout";

interface indexProps {}

const index: React.FC<indexProps> = () => {
  const backgroundImg = `url('${BUCKET_BASE_URL}/landing/hive.jpeg')`;
  return (
    <Layout>
      <Flex
        w="100%"
        h="100%"
        px={8}
        py={2}
        backgroundImage={backgroundImg}
        backgroundAttachment="fixed"
        backgroundSize="contain"
        backgroundPosition="center"
        justifyContent="center"
      >
        <Text>Test</Text>
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(urqlClient)(index);
