import { Button, ButtonProps } from "@chakra-ui/button";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import dayjs from "dayjs";
import Humanize from "humanize-plus";
import React from "react";
import {
  MemeFragment,
  useMeQuery,
  useUpVoteMemeMutation,
} from "src/generated/graphql";

type UpvoteButtonProps = {
  meme: MemeFragment;
  toggleHiveVote: () => void;
} & Partial<ButtonProps>;

export const UpvoteButton: React.FC<UpvoteButtonProps> = (props) => {
  const { meme, toggleHiveVote, isLoading, ...buttonprops } = props;
  const [{ data, error, fetching }] = useMeQuery();
  const toast = useToast();
  const [{ fetching: upFetching }, upVoteMemeFN] = useUpVoteMemeMutation();
  if (error) console.log("error", error);
  if (fetching || !data) return <></>;
  const { me } = data;
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
      if (
        me?.isHive &&
        meme.isHive &&
        dayjs(meme.createdAt) > dayjs().subtract(7, "d")
      ) {
        toggleHiveVote();
      } else {
        const { data } = await upVoteMemeFN({ memeId: meme.id });
        if (data?.upVoteMeme) {
          toast({ title: "Upvote Sent", status: "success" });
        }
      }
    }
  };
  return (
    <Button
      isActive={meme.hasUpvoted}
      isLoading={upFetching || isLoading}
      colorScheme={meme.hasUpvoted ? "green" : "gray"}
      onClick={() => handleUpvote()}
      {...buttonprops}
    >
      <ArrowUpIcon color={meme.hasUpvoted ? "white" : "green.500"} />
      <Text
        color={meme.hasUpvoted ? "white" : "green.500"}
        fontSize="15px"
        fontWeight="bold"
        m={1}
      >
        {Humanize.compactInteger(meme.ups, 1)}
      </Text>
    </Button>
  );
};
