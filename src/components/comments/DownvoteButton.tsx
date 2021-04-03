import { Button, ButtonProps } from "@chakra-ui/button";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import Humanize from "humanize-plus";
import React from "react";
import {
  CommentFragment,
  useDownVoteCommentMutation,
} from "src/generated/graphql";
import { useHasVoted } from "src/hooks/useHasVoted";

type DownvoteButtonProps = {
  comment: CommentFragment;
  isOpen: boolean;
} & Partial<ButtonProps>;

export const DownvoteButton: React.FC<DownvoteButtonProps> = (props) => {
  const { comment, isOpen, ...buttonprops } = props;
  const toast = useToast();
  const [
    { fetching: downFetching },
    downVoteMemeFN,
  ] = useDownVoteCommentMutation();
  const hasVoted = useHasVoted(comment);
  const handleDownvote = async () => {
    if (!hasVoted) {
      const { data } = await downVoteMemeFN({ commentId: comment.id });
      if (data?.downVoteComment) {
        toast({ title: "Downvote Sent", status: "success" });
      }
    }
  };
  return (
    <Button
      isActive={comment.hasDownvoted}
      isLoading={downFetching || isOpen}
      colorScheme={comment.hasDownvoted ? "red" : "gray"}
      onClick={() => handleDownvote()}
      {...buttonprops}
    >
      <ArrowDownIcon color={comment.hasDownvoted ? "white" : "red.500"} />
      <Text
        color={comment.hasDownvoted ? "white" : "red.500"}
        fontSize="15px"
        fontWeight="bold"
        m={1}
      >
        {Humanize.compactInteger(comment.downs, 1)}
      </Text>
    </Button>
  );
};
