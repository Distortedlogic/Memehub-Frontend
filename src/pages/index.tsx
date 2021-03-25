import { Button, Flex, Image, Link, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { urqlClient } from "src/urql/urqlClient";
import { BUCKET_BASE_URL } from "src/utils/constants";
import { SingleColLayout } from "./_singleColLayout";

interface indexProps {}

const index: React.FC<indexProps> = () => {
  const router = useRouter();
  return (
    <SingleColLayout>
      <Flex py={4} w="100%" h="100%" justifyContent="center">
        <Flex justifyContent="space-between" w="100%">
          <Flex w="100%" justifyContent="center" alignItems="center">
            <Image src={`${BUCKET_BASE_URL}/marketing/lion_king_elon.png`} />
          </Flex>
          <Flex
            w="100%"
            direction="column"
            justifyContent="center"
            alignItems="center"
            px={8}
          >
            <Text mb={2} textAlign="center" fontSize="xl" fontweight="bold">
              So what is Memehub?
            </Text>
            <Text>
              In an internet where memelords reign and LULz is the aim, the
              Tesla of meme sites emerges. A meme site by a memer for the memers
              all bout the memes. Where dank memes is the product, not the user.
              A site accelerating the path to sustainable dankness.
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex py={4} w="100%" h="100%" justifyContent="center">
        <Flex justifyContent="space-between" w="100%">
          <Flex
            w="100%"
            direction="column"
            justifyContent="center"
            alignItems="center"
            px={8}
          >
            <Text mb={2} textAlign="center" fontSize="xl" fontweight="bold">
              Meritocratic Cryptos Rewards for the Memers!
            </Text>
            <Text mb={4}>
              Using the 170k HP Memehub stake on the Hive Blockchain, Memehub
              alots block rewards to the memers for meme-ing. Instead of useless
              reddit karma, memers can earn crypto. At current Hive prices this
              is approx $4 in crypto every 2 hours.
            </Text>
            <Flex w="100%" justifyContent="space-around">
              <Link
                _hover={{}}
                href="https://peakd.com/about/faq"
                target="_blank"
              >
                <Button>Hive FAQ</Button>
              </Link>
              <Button onClick={() => router.push("/onboarding/newHiveAcct")}>
                Get a Hive Acct
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <Flex w="100%" justifyContent="center" alignItems="center">
          <Image src={`${BUCKET_BASE_URL}/marketing/i-quit.png`} />
        </Flex>
      </Flex>
      <Flex py={4} w="100%" h="100%" justifyContent="center">
        <Flex justifyContent="space-between" w="100%">
          <Flex w="100%" justifyContent="center" alignItems="center">
            <Image src="https://compote.slate.com/images/926e5009-c10a-48fe-b90e-fa0760f82fcd.png?width=1200&rect=680x453&offset=0x30" />
          </Flex>
          <Flex
            w="100%"
            direction="column"
            justifyContent="center"
            alignItems="center"
            px={8}
          >
            <Text mb={2} textAlign="center" fontSize="xl" fontweight="bold">
              Bringing the Stonk Market to Life!
            </Text>
            <Text>
              Using AI/ML computer vision, meme scraping, and math magic,
              Memehub has produced a system to price 500 common templates off
              real world data.
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </SingleColLayout>
  );
};

export default withUrqlClient(urqlClient)(index);
