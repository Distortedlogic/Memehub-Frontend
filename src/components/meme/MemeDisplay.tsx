import { Button } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { Image } from "@chakra-ui/image";
import { Box, BoxProps, Flex, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import { AvatarLink } from "src/components/utils/AvatarLink";
import {
  useDownVoteMemeMutation,
  UserMemeFragment,
  useUpVoteMemeMutation,
} from "src/generated/graphql";
import { ratioToColorGrade } from "src/utils/functions";
dayjs.extend(relativeTime);

interface MemeDisplayProps extends BoxProps {
  meme: UserMemeFragment;
}

export const MemeDisplay: React.FC<MemeDisplayProps> = (props) => {
  let { meme } = props;
  const [{ fetching: upFetching }, upVoteMemeFN] = useUpVoteMemeMutation();
  const [
    { fetching: downFetching },
    downVoteMemeFN,
  ] = useDownVoteMemeMutation();
  const toast = useToast();
  const hasVoted = () => {
    if (meme.hasUpvoted || meme.hasDownvoted) {
      toast({
        title: "Oops",
        description: "You already voted this meme",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return true;
    } else {
      return false;
    }
  };
  const handleUpvote = async () => {
    if (!hasVoted()) {
      const { data } = await upVoteMemeFN({ memeId: meme.id });
      if (data?.upVoteMeme) {
        meme = data?.upVoteMeme;
      }
    }
  };
  const handleDownvote = async () => {
    if (!hasVoted()) {
      const { data } = await downVoteMemeFN({ memeId: meme.id });
      if (data?.downVoteMeme) meme = data?.downVoteMeme;
    }
  };
  const { grade, color } = ratioToColorGrade(meme.ratio);
  return (
    <Box {...props} rounded="md">
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
        <Flex justifyContent="space-around" align="center" rounded="md">
          <Box mr={2}>
            <AvatarLink
              userId={meme.user.id}
              size="50px"
              src={meme.user.avatar}
            />
          </Box>
          <Box>
            <Text color="white" fontSize="md" fontWeight="bold">
              {meme.user.username}
            </Text>
            <Text color="white" fontSize="sm">
              {dayjs(meme.createdAt).fromNow()}
            </Text>
          </Box>
        </Flex>
        <Text color={color} fontSize="50px" fontWeight="bold">
          {grade}
        </Text>
        <Flex justifyContent="center" alignItems="center">
          <Button
            isActive={meme.hasDownvoted}
            isLoading={downFetching}
            variantColor={meme.hasDownvoted ? "red" : "gray"}
            onClick={handleDownvote}
            size="lg"
            mr={2}
            aria-label="downvote"
          >
            <Icon name={"arrow-down" as any} />
            <Text fontSize="15px" fontWeight="bold">
              {meme.downs}
            </Text>
          </Button>
          <Button
            isActive={meme.hasUpvoted}
            isLoading={upFetching}
            variantColor={meme.hasUpvoted ? "green" : "gray"}
            onClick={handleUpvote}
            size="lg"
            aria-label="upvote"
          >
            <Icon name="arrow-up" />
            <Text fontSize="15px" fontWeight="bold">
              {meme.ups}
            </Text>
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
