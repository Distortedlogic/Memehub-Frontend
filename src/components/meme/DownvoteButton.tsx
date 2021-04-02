import { Button, ButtonProps } from "@chakra-ui/button";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import Humanize from "humanize-plus";
import React from "react";
import { MemeFragment, useDownVoteMemeMutation } from "src/generated/graphql";

type DownvoteButtonProps = {
  meme: MemeFragment;
} & Partial<ButtonProps>;

export const DownvoteButton: React.FC<DownvoteButtonProps> = (props) => {
  const { meme, isLoading, ...buttonprops } = props;
  const toast = useToast();
  const [
    { fetching: downFetching },
    downVoteMemeFN,
  ] = useDownVoteMemeMutation();
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
  const handleDownvote = async () => {
    if (!hasVoted()) {
      const { data } = await downVoteMemeFN({ memeId: meme.id });
      if (data?.downVoteMeme) {
        toast({ title: "Downvote Sent", status: "success" });
      }
    }
  };
  return (
    <Button
      isActive={meme.hasDownvoted}
      isLoading={downFetching || isLoading}
      colorScheme={meme.hasDownvoted ? "red" : "gray"}
      onClick={() => handleDownvote()}
      {...buttonprops}
    >
      <ArrowDownIcon color={meme.hasDownvoted ? "white" : "red.500"} />
      <Text
        color={meme.hasDownvoted ? "white" : "red.500"}
        fontSize="15px"
        fontWeight="bold"
        m={1}
      >
        {Humanize.compactInteger(meme.downs, 1)}
      </Text>
    </Button>
  );
};
