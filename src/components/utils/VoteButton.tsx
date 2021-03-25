import { Button, ButtonProps } from "@chakra-ui/button";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { Text } from "@chakra-ui/layout";
import Humanize from "humanize-plus";
import React from "react";

type VoteButtonProps = {
  hasVoted?: boolean;
  fetching?: boolean;
  handleVote?: (event: React.MouseEvent<Element, MouseEvent>) => void;
  numVotes: number;
} & (
  | { upvote: boolean; downvote?: never }
  | { upvote?: never; downvote: boolean }
) &
  Partial<ButtonProps>;

export const VoteButton: React.FC<VoteButtonProps> = (props) => {
  const { upvote, numVotes, hasVoted, handleVote, fetching } = props;
  return (
    <Button
      isActive={hasVoted}
      isLoading={fetching}
      variantColor={hasVoted ? (upvote ? "green" : "red") : "gray"}
      onClick={handleVote}
      size="lg"
      m={1}
      aria-label="upvote"
      {...props}
    >
      {upvote ? (
        <ArrowUpIcon
          color={hasVoted ? "white" : upvote ? "green.500" : "red.500"}
        />
      ) : (
        <ArrowDownIcon
          color={hasVoted ? "white" : upvote ? "green.500" : "red.500"}
        />
      )}
      <Text
        color={hasVoted ? "white" : upvote ? "green.500" : "red.500"}
        fontSize="15px"
        fontWeight="bold"
        m={1}
      >
        {Humanize.compactInteger(numVotes, 1)}
      </Text>
    </Button>
  );
};
