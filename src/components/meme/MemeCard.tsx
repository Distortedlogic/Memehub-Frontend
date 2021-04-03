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
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Flex direction="column">
      <Flex {...props} justifyContent="space-between" alignItems="center" p={4}>
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
        <BottomBar
          user={user}
          meme={meme}
          isOpen={isOpen}
          onToggle={onToggle}
        />
      </Flex>
      <HiveVoteButtons
        meme={meme}
        user={user}
        isOpen={isOpen}
        onToggle={onToggle}
      />
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
  isOpen: boolean;
  onToggle: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  meme,
  isOpen,
  onToggle,
}) => {
  const { grade, color } = ratioToColorGrade(meme.ratio);
  const router = useRouter();
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
            isLoading={isOpen}
            toggleHiveVote={onToggle}
          />
          <DownvoteButton isLoading={isOpen} m={1} size="sm" meme={meme} />
        </Flex>
      </Flex>
    </>
  );
};
