import { useDisclosure } from "@chakra-ui/hooks";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { CommentStack } from "src/components/comments/CommentStack";
import { PostCommentField } from "src/components/comments/PostCommentField";
import { DownvoteButton } from "src/components/meme/utils/DownvoteButton";
import { HiveVoteButtons } from "src/components/meme/utils/HiveVoteButtons";
import { PeakdMemeLink } from "src/components/meme/utils/PeakdLink";
import { UpvoteButton } from "src/components/meme/utils/UpvoteButton";
import { AvatarLink } from "src/components/utils/AvatarLink";
import { useMemeQuery } from "src/generated/graphql";
import { urqlClient } from "src/urql/urqlClient";
import { ssr } from "src/utils/constants";
import { ratioToColorGrade } from "src/utils/functions";
import { DoubleColLayout } from "../_doubleColLayout";

dayjs.extend(relativeTime);

interface MemeProps {}

const Meme: React.FC<MemeProps> = ({}) => {
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();
  const variables = {
    memeId:
      typeof router.query.memeId === "string"
        ? (router.query.memeId as string)
        : "-1",
  };
  const pause = variables.memeId === "-1";
  const [{ data, fetching }] = useMemeQuery({ pause, variables });
  if (fetching || !data?.meme) {
    return (
      <DoubleColLayout>
        <Flex h="80vh"></Flex>
      </DoubleColLayout>
    );
  }
  const { meme } = data;
  const { grade, color } = ratioToColorGrade(meme.ratio);
  return (
    <DoubleColLayout>
      <Flex justifyContent="center" alignItems="center">
        <Flex direction="column" w="60%">
          <Flex direction="column">
            <Flex
              rounded="md"
              backgroundColor="black"
              justifyContent="center"
              mb={2}
              p={4}
            >
              <Image w="80%" rounded="md" src={meme.url} my={2} />
            </Flex>
            <Flex
              rounded="md"
              backgroundColor="black"
              justifyContent="space-around"
              align="center"
              py={1}
            >
              <Flex justifyContent="space-around" alignItems="center">
                <AvatarLink
                  mr={2}
                  userId={meme.user.id}
                  size="md"
                  src={meme.user.avatar}
                />
                <Box>
                  <Text fontSize="md" fontWeight="bold">
                    {meme.user.username}
                  </Text>
                  <Text fontSize="sm">{dayjs(meme.createdAt).fromNow()}</Text>
                </Box>
              </Flex>
              <Text color={color} fontSize="50px" fontWeight="bold">
                {grade}
              </Text>
              <PeakdMemeLink meme={meme} user={meme.user} imgHeight="40px" />
              <Flex justifyContent="center" alignItems="center">
                <UpvoteButton
                  isLoading={isOpen}
                  meme={meme}
                  toggleHiveVote={onToggle}
                  m={1}
                />
                <DownvoteButton m={1} isLoading={isOpen} meme={meme} />
              </Flex>
            </Flex>
            <HiveVoteButtons
              meme={meme}
              user={meme.user}
              isOpen={isOpen}
              onToggle={onToggle}
            />
          </Flex>
          <PostCommentField meme={data.meme} />
          <CommentStack memeId={data.meme.id} />
        </Flex>
      </Flex>
    </DoubleColLayout>
  );
};

export default withUrqlClient(urqlClient, { ssr })(Meme);
