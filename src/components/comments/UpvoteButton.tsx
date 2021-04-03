import { Button, ButtonProps } from "@chakra-ui/button";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import dayjs from "dayjs";
import Humanize from "humanize-plus";
import React from "react";
import {
  CommentFragment,
  useMeQuery,
  useUpVoteCommentMutation,
} from "src/generated/graphql";
import { useHasVoted } from "src/hooks/useHasVoted";

type UpvoteButtonProps = {
  comment: CommentFragment;
  toggleHiveVote: () => void;
  isOpen: boolean;
} & Partial<ButtonProps>;

export const UpvoteButton: React.FC<UpvoteButtonProps> = (props) => {
  const { comment, isOpen, toggleHiveVote, ...buttonprops } = props;
  const toast = useToast();
  const [
    { fetching: upFetching },
    upVoteCommentFN,
  ] = useUpVoteCommentMutation();
  const [{ data, error, fetching }] = useMeQuery();
  if (error) console.log("error", error);
  if (fetching || !data) return <></>;
  const { me } = data;
  const hasVoted = useHasVoted(comment);
  const handleUpvote = async () => {
    if (!hasVoted) {
      if (
        me?.isHive &&
        comment.isHive &&
        dayjs(comment.createdAt) > dayjs().subtract(7, "d")
      ) {
        toggleHiveVote();
      } else {
        const { data } = await upVoteCommentFN({ commentId: comment.id });
        if (data?.upVoteComment) {
          toast({ title: "Upvote Sent", status: "success" });
        }
      }
    }
  };
  return (
    <Button
      isActive={comment.hasUpvoted}
      isLoading={upFetching || isOpen}
      colorScheme={comment.hasUpvoted ? "green" : "gray"}
      onClick={() => handleUpvote()}
      {...buttonprops}
    >
      <ArrowUpIcon color={comment.hasUpvoted ? "white" : "green.500"} />
      <Text
        color={comment.hasUpvoted ? "white" : "green.500"}
        fontSize="15px"
        fontWeight="bold"
        m={1}
      >
        {Humanize.compactInteger(comment.ups, 1)}
      </Text>
    </Button>
  );
};
