import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Image } from "@chakra-ui/image";
import { Badge, Box, BoxProps, Flex, Text } from "@chakra-ui/layout";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/slider";
import { useToast } from "@chakra-ui/toast";
import { Collapse } from "@chakra-ui/transition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VoteOperation } from "@hiveio/dhive";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Form, Formik } from "formik";
import Humanize from "humanize-plus";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AvatarLink } from "src/components/utils/AvatarLink";
import { VoteButton } from "src/components/utils/VoteButton";
import {
  useDownVoteMemeMutation,
  useMeQuery,
  UserMemeFragment,
  useUpVoteMemeMutation,
} from "src/generated/graphql";
import { ratioToColorGrade } from "src/utils/functions";
dayjs.extend(relativeTime);

interface MemeProps extends BoxProps {
  meme: UserMemeFragment;
}

export const MemeBox: React.FC<MemeProps> = (props) => {
  let { meme } = props;
  const router = useRouter();

  return (
    <Box {...props} p={6} rounded="md" backgroundColor="black">
      <TopBar meme={meme} />
      <Text textAlign="center" color="white">
        {meme.title}
      </Text>
      <Box
        _hover={{ cursor: "pointer" }}
        onClick={() => {
          router.push(`meme/${meme.id}`);
        }}
        p={2}
      >
        <Image rounded="md" w="auto" src={meme.url} />
      </Box>
      <BottomBar meme={meme} />
    </Box>
  );
};

interface TopBarProps {
  meme: UserMemeFragment;
}

export const TopBar: React.FC<TopBarProps> = ({ meme }) => {
  const hiveBadge = meme.user.isHive ? (
    <Badge ml="2" colorSchema="red">
      Hive
    </Badge>
  ) : null;
  const ogBadge = [
    "memehub",
    "aninsidejob",
    "cmmemes",
    "anthonyadavisii",
    "memehub.bot",
  ].includes(meme.user.username) ? (
    <Badge ml="2" colorSchema="blue">
      OG
    </Badge>
  ) : null;
  const topBar = (
    <Flex justifyContent="center" alignItems="center">
      <AvatarLink userId={meme.user.id} size="md" src={meme.user.avatar} />
      <Box ml={2}>
        <Text fontSize="md" color="white" fontWeight="bold" mx={2}>
          {meme.user.username}
        </Text>
        <Flex>
          {hiveBadge}
          {ogBadge}
        </Flex>
      </Box>
    </Flex>
  );

  return (
    <Flex mb={4} justifyContent="space-between">
      {topBar}
      <Text color="white" fontSize="sm" mx={2}>
        {dayjs(meme.createdAt).fromNow()}
      </Text>
    </Flex>
  );
};

interface BottomBarProps {
  meme: UserMemeFragment;
}

export const BottomBar: React.FC<BottomBarProps> = ({ meme }) => {
  const { grade, color } = ratioToColorGrade(meme.ratio);
  const [{ data, error, fetching }] = useMeQuery();
  const { isOpen, onToggle } = useDisclosure();
  const toast = useToast();
  const [{ fetching: upFetching }, upVoteMemeFN] = useUpVoteMemeMutation();
  const [
    { fetching: downFetching },
    downVoteMemeFN,
  ] = useDownVoteMemeMutation();
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
        onToggle();
      } else {
        const { data } = await upVoteMemeFN({ memeId: meme.id });
        if (data?.upVoteMeme) {
          meme = data?.upVoteMeme;
        }
      }
    }
  };
  const handleDownvote = async () => {
    if (!hasVoted()) {
      const { data } = await downVoteMemeFN({ memeId: meme.id });
      if (data?.downVoteMeme) {
        meme = data?.downVoteMeme;
      }
    }
  };
  const handleSubmit = async (weight: number) => {
    const url_split = meme.url.split("/");
    const permlink = url_split[url_split.length - 1].split(".")[0];
    const op: VoteOperation = [
      "vote",
      {
        voter: me!.username,
        author: meme.user.username,
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
          const { data } = await upVoteMemeFN({ memeId: meme.id });
          if (data?.upVoteMeme) {
            meme = data?.upVoteMeme;
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
    <>
      <Flex mt={2} justifyContent="space-between" align="center">
        <VoteButton
          downvote
          size="sm"
          numVotes={meme.downs}
          fetching={downFetching}
          handleVote={handleDownvote}
          hasVoted={meme.hasDownvoted}
        />
        <NextLink href="/meme/[memeId]" as={`/meme/${meme.id}`}>
          <Button size="sm" m={1}>
            <FontAwesomeIcon icon="comment-alt" size="lg" />
            <Text fontSize="15px" fontWeight="bold" ml={2}>
              {Humanize.compactInteger(meme.numComments, 1)}
            </Text>
          </Button>
        </NextLink>
        <Flex mr={2} justifyContent="center" alignItems="center">
          <Text color={color} ml={2} fontSize="30px" fontWeight="bold">
            {grade}
          </Text>
        </Flex>
        <VoteButton
          upvote
          size="sm"
          numVotes={meme.ups}
          fetching={upFetching}
          handleVote={handleUpvote}
          hasVoted={meme.hasUpvoted}
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
                <Button
                  mt={2}
                  type="submit"
                  colorSchema="blue"
                  isLoading={isSubmitting}
                >
                  Vote
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Collapse>
    </>
  );
};
