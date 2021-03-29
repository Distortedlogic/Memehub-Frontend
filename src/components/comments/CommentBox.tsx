import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Flex, Text } from "@chakra-ui/layout";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/slider";
import { useToast } from "@chakra-ui/toast";
import { Collapse } from "@chakra-ui/transition";
import { VoteOperation } from "@hiveio/dhive";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Form, Formik } from "formik";
import React from "react";
import { AvatarLink } from "src/components/utils/AvatarLink";
import {
  EmojiFragment,
  useDownVoteCommentMutation,
  useMeQuery,
  UserCommentFragment,
  UserFragment,
  useUpVoteCommentMutation,
} from "src/generated/graphql";
import { getHash, ratioToColorGrade } from "src/utils/functions";
import { insertEmojis } from "src/utils/insertEmojis";
import { VoteButton } from "../utils/VoteButton";
dayjs.extend(relativeTime);

interface CommentBoxProps {
  comment: UserCommentFragment;
  emojis: EmojiFragment[];
}

export const CommentBox: React.FC<CommentBoxProps> = ({ comment, emojis }) => {
  const { isOpen, onToggle } = useDisclosure();
  const [{ fetching, data, error }] = useMeQuery();
  const [, upVoteCommentFN] = useUpVoteCommentMutation();
  const toast = useToast();
  if (error) console.log(error);
  if (fetching || !data) {
    return <></>;
  }
  const { me } = data;
  const handleSubmit = async (weight: number) => {
    const permlink = await getHash(comment.text + comment.user.username);
    const op: VoteOperation = [
      "vote",
      {
        voter: me!.username,
        author: comment.user.username,
        permlink,
        weight,
      },
    ];
    window.hive_keychain.requestBroadcast(
      me!.username,
      [op],
      "Posting",
      async (resp: any) => {
        if (resp.success) {
          const { data } = await upVoteCommentFN({ commentId: comment.id });
          if (data?.upVoteComment) {
            comment = data?.upVoteComment;
          }
          toast({
            description: "Upvoted on Hive!",
            duration: 1000 * 3,
            isClosable: true,
            status: "success",
          });
          onToggle();
        } else {
          toast({
            description: "Ooh no, upvoting on Hive didnt work!",
            duration: 1000 * 3,
            isClosable: true,
            status: "error",
          });
        }
      }
    );
  };
  return (
    <Flex direction="column" backgroundColor="black" p={2} mb={2} rounded="md">
      <Flex align="center" justifyContent="space-between">
        <CommentLeftSide createdAt={comment.createdAt} user={comment.user} />
        <Text p={4} fontSize="18px" w="60%">
          {insertEmojis(comment.text, emojis)}
        </Text>
        <CommentRightSide
          isOpen={isOpen}
          onToggle={onToggle}
          comment={comment}
        />
      </Flex>
      <Collapse in={isOpen}>
        <Formik
          initialValues={{ voteWieght: 100 }}
          onSubmit={async (values) => {
            handleSubmit(values.voteWieght * 100);
          }}
        >
          {({ isSubmitting, values: { voteWieght }, setFieldValue }) => (
            <Form>
              <Flex mt={4} direction="column">
                <Flex>
                  <Slider
                    onChange={(newValue) =>
                      setFieldValue("voteWieght", newValue)
                    }
                    max={100}
                    min={0}
                    step={1}
                    defaultValue={voteWieght}
                  >
                    <SliderTrack bg="gray.100" />
                    <SliderFilledTrack bg="blue.500" />
                    <SliderThumb size={6}>
                      <Box color="green" />
                    </SliderThumb>
                  </Slider>
                  <Button w="50px" ml={8}>
                    {voteWieght}
                  </Button>
                </Flex>
                <Button mt={2} type="submit" isLoading={isSubmitting}>
                  Vote
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Collapse>
    </Flex>
  );
};

interface CommentLeftSideProps {
  createdAt: string;
  user: UserFragment;
}

export const CommentLeftSide: React.FC<CommentLeftSideProps> = ({
  createdAt,
  user,
}) => {
  return (
    <Flex alignSelf="start" w="30%">
      <AvatarLink m={2} userId={user.id} size="sm" src={user.avatar} />
      <Flex direction="column" justifyContent="center">
        <Text fontSize="md" fontWeight="bold">
          {user.username}
        </Text>
        <Text fontSize="sm">{dayjs(createdAt).fromNow()}</Text>
      </Flex>
    </Flex>
  );
};

interface CommentRightSideProps {
  comment: UserCommentFragment;
  onToggle: () => void;
  isOpen: boolean;
}

export const CommentRightSide: React.FC<CommentRightSideProps> = ({
  comment,
  onToggle,
  isOpen,
}) => {
  const [{ fetching, data, error }] = useMeQuery();
  const [
    { fetching: upFetching },
    upVoteCommentFN,
  ] = useUpVoteCommentMutation();
  const [
    { fetching: downFetching },
    downVoteCommentFN,
  ] = useDownVoteCommentMutation();
  const toast = useToast();
  if (error) console.log(error);
  if (fetching || !data) {
    return <></>;
  }
  const { me } = data;
  const hasVoted = () => {
    if (comment.hasUpvoted || comment.hasDownvoted) {
      toast({
        title: "Oops",
        description: "You already voted this comment",
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
      if (me?.isHive && comment.isHive) {
        onToggle();
      } else {
        const { data, error } = await upVoteCommentFN({
          commentId: comment.id,
        });
        if (error) console.log("errror", error);
        if (data?.upVoteComment) {
          comment = data?.upVoteComment;
        }
      }
    }
  };
  const handleDownvote = async () => {
    if (!hasVoted()) {
      const { data } = await downVoteCommentFN({ commentId: comment.id });
      if (data?.downVoteComment) comment = data?.downVoteComment;
    }
  };
  const { grade, color } = ratioToColorGrade(comment.ratio);

  return (
    <>
      <Flex
        direction="column"
        justifyContent="space-around"
        align="center"
        alignSelf="end"
      >
        <VoteButton
          upvote
          numVotes={comment.ups}
          hasVoted={comment.hasUpvoted}
          handleVote={handleUpvote}
          fetching={upFetching || isOpen}
          size="md"
        />
        <Flex justifyContent="space-around">
          <Text color={color} fontSize="15px" fontWeight="bold" m={1}>
            {grade}
          </Text>
        </Flex>
        <VoteButton
          downvote
          numVotes={comment.downs}
          hasVoted={comment.hasDownvoted}
          handleVote={handleDownvote}
          fetching={downFetching}
          size="md"
        />
      </Flex>
    </>
  );
};
