import { Image } from "@chakra-ui/image";
import { Flex } from "@chakra-ui/layout";
import { BUCKET_BASE_URL } from "src/utils/constants";

export const endMessage = (
  <Flex
    justifyContent="center"
    alignContent="center"
    backgroundColor="black"
    rounded="md"
    mt={2}
    py={8}
  >
    <Image size="200px" src={`${BUCKET_BASE_URL}/misc/no-more.png`} />
  </Flex>
);
