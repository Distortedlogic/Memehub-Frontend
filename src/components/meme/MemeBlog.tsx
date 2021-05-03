import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Badge, Box, BoxProps, Flex, Text } from "@chakra-ui/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ellipsize from "ellipsize";
import Humanize from "humanize-plus";
import { useRouter } from "next/router";
import React from "react";
import { AvatarLink } from "src/components/utils/AvatarLink";
import {
  MemeFragment,
  useMemeEmojisQuery,
  useMeQuery,
  UserFragment,
} from "src/generated/graphql";
import { useStoreState } from "src/store/store";
import { ADMIN_NAME } from "src/utils/constants";
import { ratioToColorGrade } from "src/utils/functions";
import { AddEmoji } from "../emojis/AddEmoji";
import { EmojiButton } from "../emojis/EmojiButton";
import { MemeModal } from "./MemeModal";
import { DeleteButton } from "./utils/DeleteButton";
import { DownvoteButton } from "./utils/DownvoteButton";
import { HiveVoteButtons } from "./utils/HiveVoteButtons";
import { PeakdMemeLink } from "./utils/PeakdLink";
import { UpvoteButton } from "./utils/UpvoteButton";
dayjs.extend(relativeTime);

interface MemeBlogProps extends BoxProps {
  displayUser: boolean;
  meme: MemeFragment;
  user: UserFragment;
}

export const MemeBlog: React.FC<MemeBlogProps> = (props) => {
  let { meme, user, displayUser, ...boxprops } = props;
  const router = useRouter();
  return (
    <Flex direction="column" {...boxprops} p={6}>
      <TopBar meme={meme} user={user} displayUser={displayUser} />
      <Flex
        _hover={{ cursor: "pointer" }}
        onClick={() => {
          router.push(`/meme/${meme.id}`);
        }}
        justifyContent="center"
        alignItems="center"
        p={2}
      >
        <MemeModal rounded="md" w="auto" url={meme.url} />
      </Flex>
      <BottomBar user={user} meme={meme} />
    </Flex>
  );
};

interface TopBarProps {
  displayUser: boolean;
  meme: MemeFragment;
  user: UserFragment;
}

const TopBar: React.FC<TopBarProps> = ({ user, meme, displayUser }) => {
  const {
    settings: { gridView },
  } = useStoreState((state) => state);
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

  if (displayUser) {
    if (gridView === "grid") {
      return (
        <Flex alignItems="center" direction="column">
          {topBar}
          <Text mt={2} fontSize="sm">
            {dayjs(meme.createdAt).fromNow()}
          </Text>
          <Text textAlign="center">{ellipsize(meme.title, 40)}</Text>
        </Flex>
      );
    } else {
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
    }
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
  const [{ data: meData, fetching: meFetching, error: meError }] = useMeQuery();
  const [
    { data: MemeEmojisData, error: MemeEmojisError },
    refetch,
  ] = useMemeEmojisQuery({ variables: { memeId: meme.id } });
  if (MemeEmojisError) console.log(MemeEmojisError);
  const emojis = MemeEmojisData?.memeEmojis.map((emoji) => (
    <EmojiButton refetch={refetch} emoji={emoji} memeId={meme.id} />
  ));
  const canDelete =
    !meError &&
    !meFetching &&
    meData?.me &&
    (meme.userId === meData.me.id || meData.me.username === ADMIN_NAME) &&
    !meme.isHive;
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
      <Flex justifyContent="center" alignItems="center" my={1}>
        {canDelete ? <DeleteButton meme={meme} /> : null}
        <Button m={1} size="sm">
          <Text color={color}>{grade}</Text>
        </Button>
        <AddEmoji refetch={refetch} m={1} memeId={meme.id} />
      </Flex>
      <Flex justifyContent="center" alignItems="center">
        {emojis}
      </Flex>
    </>
  );
};
