import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Badge, Box, Flex, FlexProps, Text } from "@chakra-ui/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ellipsize from "ellipsize";
import Humanize from "humanize-plus";
import { useRouter } from "next/router";
import React from "react";
import { AvatarLink } from "src/components/utils/AvatarLink";
import { MemeFragment, useMeQuery, UserFragment } from "src/generated/graphql";
import { ratioToColorGrade } from "src/utils/functions";
import { ADMIN_NAME } from "../../utils/constants";
import { MemeModal } from "./MemeModal";
import { DeleteButton } from "./utils/DeleteButton";
import { DownvoteButton } from "./utils/DownvoteButton";
import { HiveVoteButtons } from "./utils/HiveVoteButtons";
import { PeakdMemeLink } from "./utils/PeakdLink";
import { UpvoteButton } from "./utils/UpvoteButton";
dayjs.extend(relativeTime);

interface MemeListProps extends FlexProps {
  displayUser: boolean;
  meme: MemeFragment;
  user: UserFragment;
}

export const MemeList: React.FC<MemeListProps> = (props) => {
  let { meme, user, displayUser } = props;
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Flex w="100%" direction="column">
      <Flex {...props} justifyContent="space-between" alignItems="center" p={4}>
        <Flex alignItems="center" direction="column">
          <Flex
            _hover={{ cursor: "pointer" }}
            onClick={() => {
              router.push(`meme/${meme.id}`);
            }}
            justifyContent="center"
            alignItems="center"
          >
            <MemeModal rounded="md" w="150px" url={meme.url} />
          </Flex>
          <Text fontSize="sm">{dayjs(meme.createdAt).fromNow()}</Text>
        </Flex>
        <TopBar meme={meme} user={user} displayUser={displayUser} />
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
  displayUser: boolean;
  meme: MemeFragment;
  user: UserFragment;
}

export const TopBar: React.FC<TopBarProps> = ({ user, meme, displayUser }) => {
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

  if (displayUser) {
    return (
      <Flex w="100%" direction="column" px={4}>
        <Flex mb={4} justifyContent="start" alignItems="center">
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
        <Flex>
          <PeakdMemeLink mr={4} meme={meme} user={user} imgHeight="30px" />
          <Text textAlign="center">{ellipsize(meme.title, 40)}</Text>
        </Flex>
      </Flex>
    );
  } else {
    return (
      <Flex w="100%" px={4}>
        <Flex justifyContent="center" alignItems="center">
          <PeakdMemeLink meme={meme} user={user} imgHeight="30px" />
        </Flex>
        <Text mr={4} textAlign="center">
          {ellipsize(meme.title, 20)}
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
  const [{ data, fetching, error }] = useMeQuery();
  const canDelete =
    !error &&
    !fetching &&
    data?.me &&
    (meme.userId === data.me.id || data.me.username === ADMIN_NAME) &&
    !meme.isHive;
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
          {canDelete ? <DeleteButton meme={meme} /> : null}
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
