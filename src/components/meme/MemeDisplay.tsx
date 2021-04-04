import { useDisclosure } from "@chakra-ui/hooks";
import { Image } from "@chakra-ui/image";
import { Box, Flex, FlexProps, Text } from "@chakra-ui/layout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import { AvatarLink } from "src/components/utils/AvatarLink";
import { UserMemeFragment } from "src/generated/graphql";
import { ratioToColorGrade } from "src/utils/functions";
import { DownvoteButton } from "./DownvoteButton";
import { HiveVoteButtons } from "./HiveVoteButtons";
import { PeakdMemeLink } from "./PeakdLink";
import { UpvoteButton } from "./UpvoteButton";
dayjs.extend(relativeTime);

interface MemeDisplayProps extends FlexProps {
  meme: UserMemeFragment;
}

export const MemeDisplay: React.FC<MemeDisplayProps> = (props) => {
  let { meme, ...flexprops } = props;
  const { grade, color } = ratioToColorGrade(meme.ratio);
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Flex direction="column" {...flexprops}>
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
  );
};
