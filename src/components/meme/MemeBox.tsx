import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Image } from "@chakra-ui/image";
import { Badge, Box, BoxProps, Flex, Text } from "@chakra-ui/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ellipsize from "ellipsize";
import Humanize from "humanize-plus";
import { useRouter } from "next/router";
import React from "react";
import { AvatarLink } from "src/components/utils/AvatarLink";
import { MemeFragment, UserFragment } from "src/generated/graphql";
import { ratioToColorGrade } from "src/utils/functions";
import { DownvoteButton } from "./DownvoteButton";
import { HiveVoteButtons } from "./HiveVoteButtons";
import { PeakdMemeLink } from "./PeakdLink";
import { UpvoteButton } from "./UpvoteButton";
dayjs.extend(relativeTime);

type MemeProps = Partial<BoxProps> & {
  topfull: boolean;
  meme: MemeFragment;
  user: UserFragment;
};

export const MemeBox: React.FC<MemeProps> = (props) => {
  let { meme, user, topfull, ...boxprops } = props;
  const router = useRouter();
  return (
    <Box {...boxprops} p={6} rounded="md" backgroundColor="black">
      <TopBar meme={meme} user={user} topfull={topfull} />
      <Flex
        _hover={{ cursor: "pointer" }}
        onClick={() => {
          router.push(`/meme/${meme.id}`);
        }}
        justifyContent="center"
        alignItems="center"
        p={2}
      >
        <Image rounded="md" w="auto" src={meme.url} />
      </Flex>
      <BottomBar user={user} meme={meme} />
    </Box>
  );
};

interface TopBarProps {
  topfull: boolean;
  meme: MemeFragment;
  user: UserFragment;
}

const TopBar: React.FC<TopBarProps> = ({ user, meme, topfull }) => {
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
      <AvatarLink userId={user.id} size="md" src={user.avatar} />
      <Box ml={2}>
        <Text fontSize="md" fontWeight="bold" mx={2}>
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
      <Flex direction="column">
        <Flex mb={4} justifyContent="space-between">
          {topBar}
          <Text fontSize="sm" mx={2}>
            {dayjs(meme.createdAt).fromNow()}
          </Text>
        </Flex>
        <Text textAlign="center">{ellipsize(meme.title, 40)}</Text>
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
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure();
  return (
    <>
      <Flex mt={2} justifyContent="center" align="center">
        <DownvoteButton isLoading={isOpen} size="sm" meme={meme} />
        <Button size="sm" m={1} onClick={() => router.push(`/meme/${meme.id}`)}>
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
        <UpvoteButton
          isLoading={isOpen}
          size="sm"
          meme={meme}
          toggleHiveVote={onToggle}
        />
        <PeakdMemeLink ml={4} meme={meme} user={user} imgHeight="30px" />
      </Flex>
      <HiveVoteButtons
        meme={meme}
        user={user}
        isOpen={isOpen}
        onToggle={onToggle}
      />
    </>
  );
};
