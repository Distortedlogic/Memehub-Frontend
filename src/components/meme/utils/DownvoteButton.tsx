import { Button, ButtonProps } from "@chakra-ui/button";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import Humanize from "humanize-plus";
import React from "react";
import { MemeFragment, useDownVoteMemeMutation } from "src/generated/graphql";
import { useHasVoted } from "src/hooks/useHasVoted";

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
  const hasVoted = useHasVoted(meme);
  const handleDownvote = async () => {
    if (!hasVoted()) {
      const { data } = await downVoteMemeFN({ memeId: meme.id });
      if (data?.downVoteMeme) {
        toast({ title: "Downvote Sent", status: "error" });
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
