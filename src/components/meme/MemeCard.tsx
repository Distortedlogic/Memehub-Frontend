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
import { Collapse } from "@chakra-ui/transition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ellipsize from "ellipsize";
import { Form, Formik } from "formik";
import Humanize from "humanize-plus";
import { useRouter } from "next/router";
import React from "react";
import { AvatarLink } from "src/components/utils/AvatarLink";
import { MemeFragment, UserFragment } from "src/generated/graphql";
import { useHandleMemeHiveVote } from "src/hooks/useHandleHiveVote";
import { ratioToColorGrade } from "src/utils/functions";
import { DownvoteButton } from "./DownvoteButton";
import { UpvoteButton } from "./UpvoteButton";
dayjs.extend(relativeTime);

interface MemeCardProps extends BoxProps {
  topfull: boolean;
  meme: MemeFragment;
  user: UserFragment;
}

export const MemeCard: React.FC<MemeCardProps> = (props) => {
  let { meme, user, topfull } = props;
  const router = useRouter();

  return (
    <Flex
      {...props}
      justifyContent="space-between"
      alignItems="center"
      p={4}
      rounded="md"
    >
      <Flex
        _hover={{ cursor: "pointer" }}
        onClick={() => {
          router.push(`meme/${meme.id}`);
        }}
        justifyContent="center"
        alignItems="center"
      >
        <Image rounded="md" w="150px" src={meme.url} />
      </Flex>
      <TopBar meme={meme} user={user} topfull={topfull} />

      <BottomBar user={user} meme={meme} />
    </Flex>
  );
};

interface TopBarProps {
  topfull: boolean;
  meme: MemeFragment;
  user: UserFragment;
}

export const TopBar: React.FC<TopBarProps> = ({ user, meme, topfull }) => {
  const hiveBadge = user.isHive ? (
    <Badge ml="2" colorScheme="red">
      Hive
    </Badge>
  ) : null;
  const ogBadge = [
    "memehub",
    "aninsidejob",
    "cmmemes",
    "anthonyadavisii",
    "memehub.bot",
  ].includes(user.username) ? (
    <Badge ml="2" colorScheme="blue">
      OG
    </Badge>
  ) : null;
  const topBar = (
    <Flex justifyContent="center" alignItems="center">
      <AvatarLink userId={user.id} size="sm" src={user.avatar} />
      <Box ml={2}>
        <Text fontSize="md" mx={2}>
          {user.username}
        </Text>
        <Flex>
          {hiveBadge}
          {ogBadge}
        </Flex>
      </Box>
    </Flex>
  );

  if (topfull) {
    return (
      <Flex w="100%" direction="column" px={4}>
        <Flex mb={4} justifyContent="start" alignItems="center">
          {topBar}
          <Text fontSize="sm" mx={2}>
            {dayjs(meme.createdAt).fromNow()}
          </Text>
        </Flex>
        <Text textAlign="center">{ellipsize(meme.title, 16)}</Text>
      </Flex>
    );
  } else {
    return (
      <Flex mb={4} justifyContent="space-between">
        <Text mx={2} textOverflow="ellipsis">
          {ellipsize(meme.title, 20)}
        </Text>
        <Text fontSize="sm" mx={2}>
          {dayjs(meme.createdAt).fromNow()}
        </Text>
      </Flex>
    );
  }
};

interface BottomBarProps {
  user: UserFragment;
  meme: MemeFragment;
}

export const BottomBar: React.FC<BottomBarProps> = ({ meme, user }) => {
  const { grade, color } = ratioToColorGrade(meme.ratio);
  const { isOpen: hiveVoteOpen, onToggle: toggleHiveVote } = useDisclosure();
  const router = useRouter();
  const handleHiveVote = useHandleMemeHiveVote(meme, user);
  return (
    <>
      <Flex justifyContent="center" align="center">
        <Flex direction="column">
          <Button
            size="sm"
            m={1}
            onClick={() => router.push(`/meme/${meme.id}`)}
          >
            <FontAwesomeIcon icon="comment-alt" size="lg" />
            <Text fontSize="15px" fontWeight="bold" ml={2}>
              {Humanize.compactInteger(meme.numComments, 1)}
            </Text>
          </Button>
          <Flex mr={2} justifyContent="center" alignItems="center">
            <Text color={color} ml={2} fontSize="30px" fontWeight="bold">
              {grade}
            </Text>
          </Flex>
        </Flex>
        <Flex direction="column">
          <UpvoteButton
            m={1}
            size="sm"
            meme={meme}
            isLoading={hiveVoteOpen}
            toggleHiveVote={toggleHiveVote}
          />
          <DownvoteButton
            isLoading={hiveVoteOpen}
            m={1}
            size="sm"
            meme={meme}
          />
        </Flex>
      </Flex>
      <Collapse in={hiveVoteOpen}>
        <Formik
          initialValues={{ voteWieght: 100 }}
          onSubmit={async (values) => {
            handleHiveVote(values.voteWieght * 100);
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
                  colorScheme="blue"
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
