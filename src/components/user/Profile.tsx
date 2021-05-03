import {
  Avatar,
  BoxProps,
  Button,
  Divider,
  Flex,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { loader } from "src/components/utils/loader";
import {
  CommentFragment,
  UserFragment,
  useUserCommentsQuery,
  useUserMemesQuery,
} from "src/generated/graphql";
import { DoubleColLayout } from "src/pages/_doubleColLayout";
import { ratioToColorGrade } from "src/utils/functions";
import { DownvoteButton } from "../comments/DownvoteButton";
import { UpvoteButton } from "../comments/UpvoteButton";
import { PagedMemes } from "../meme/PagedMemes";
import { endMessage } from "../utils/endMessage";
dayjs.extend(relativeTime);
const take = 16;
interface ProfileProps {
  user: UserFragment;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isMemes, setIsMemes] = useState(true);
  const [order, setOrder] = useState("new");
  const router = useRouter();
  return (
    <DoubleColLayout>
      <Flex direction="column" mt={4}>
        <Flex w="100%" alignItems="center" justifyContent="space-around">
          <Flex alignItems="center" direction="column">
            <Avatar src={user.avatar} size="xl" />
            <Text textAlign="center" py={2} fontWeight="bold" fontSize="20px">
              {user.username}
            </Text>
            <Flex justifyContent="center">
              <Button
                onClick={() => router.push(`/user/trade-history/${user.id}`)}
                mr={2}
              >
                Trade History
              </Button>
              <Button onClick={() => router.push(`/user/wallet/${user.id}`)}>
                Wallet
              </Button>
            </Flex>
          </Flex>
        </Flex>

        <Flex my={2} mb={4} justifyContent="center">
          <Divider w="95%" />
        </Flex>
        <Flex justifyContent="space-around">
          <Flex>
            <Button
              mr={4}
              colorScheme={isMemes ? "blue" : "gray"}
              onClick={() => setIsMemes(true)}
            >
              Memes
            </Button>
            <Button
              colorScheme={!isMemes ? "blue" : "gray"}
              onClick={() => setIsMemes(false)}
            >
              comments
            </Button>
          </Flex>
          <Flex>
            <Button
              colorScheme={order === "ratio" ? "blue" : "gray"}
              onClick={() => setOrder("ratio")}
              mr={4}
            >
              Top Ratio
            </Button>
            <Button
              colorScheme={order === "upvoted" ? "blue" : "gray"}
              onClick={() => setOrder("upvoted")}
              mr={4}
            >
              Top Upvoted
            </Button>
            <Button
              colorScheme={order === "new" ? "blue" : "gray"}
              onClick={() => setOrder("new")}
            >
              New
            </Button>
          </Flex>
        </Flex>
        {isMemes ? (
          <Flex justifyContent="center" alignItems="center">
            <Memes user={user} order={order} />
          </Flex>
        ) : (
          <Comments userId={user.id} order={order} />
        )}
      </Flex>
    </DoubleColLayout>
  );
};

interface MemesProps {
  user: UserFragment;
  order: string;
}

const Memes: React.FC<MemesProps> = ({ user, order }) => {
  const [skip, setSkip] = useState(0);
  const [{ data, error, fetching }] = useUserMemesQuery({
    variables: { userId: user.id, order, skip, take },
  });
  const loadMore = () => setSkip(skip + take);
  if (error) console.log("error", error);
  if (!data || fetching || !data.userMemes) {
    return <Flex minHieght="25vh"></Flex>;
  }
  const { hasMore, items: memes } = data.userMemes;
  return (
    <PagedMemes
      user={user}
      pagedMemes={memes}
      hasMore={hasMore}
      loadMore={loadMore}
    />
  );
};

interface CommentsProps {
  order: string;
  userId: string;
}

export const Comments: React.FC<CommentsProps> = ({ order, userId }) => {
  const [skip, setSkip] = useState(0);
  const loadMore = () => setSkip(skip + take);
  const [{ data, fetching }] = useUserCommentsQuery({
    variables: {
      userId,
      take,
      skip,
      order,
    },
  });
  if (fetching || !data?.userComments) {
    return <Flex minHeight="40vh"></Flex>;
  }
  const { items: comments, hasMore } = data.userComments;
  return (
    <InfiniteScroll
      dataLength={comments.length}
      next={loadMore}
      hasMore={hasMore}
      loader={loader}
      endMessage={endMessage}
    >
      <Stack minHeight="25vh" py={6} px={12}>
        {comments.map((comment) => (
          <>
            <CommentBox key={comment.id} comment={comment} />
            <Divider />
          </>
        ))}
      </Stack>
    </InfiniteScroll>
  );
};

interface CommentBoxProps extends BoxProps {
  comment: CommentFragment;
}

export const CommentBox: React.FC<CommentBoxProps> = (props) => {
  let { comment, ...boxProps } = props;
  const router = useRouter();
  const { grade, color } = ratioToColorGrade(comment.ratio);
  return (
    <Flex
      justifyContent="space-between"
      align="center"
      {...boxProps}
      p={4}
      rounded="md"
    >
      <Flex alignSelf="start" direction="column" w="20%">
        <Text fontSize="sm" m={1}>
          {dayjs(comment.createdAt).fromNow()}
        </Text>
        <Image
          _hover={{ cursor: "pointer" }}
          onClick={() => router.push(`/meme/${comment.meme.id}`)}
          src={comment.meme.url}
        />
      </Flex>
      <Text fontSize="18px" w="60%">
        {comment.text}
      </Text>
      <Flex
        direction="column"
        justifyContent="space-around"
        alignItems="center"
      >
        <UpvoteButton
          comment={comment}
          toggleHiveVote={() => {}}
          isOpen={false}
        />
        <Flex justifyContent="space-around">
          <Text color={color} fontSize="15px" fontWeight="bold" m={1}>
            {grade}
          </Text>
        </Flex>
        <DownvoteButton comment={comment} isOpen={false} />
      </Flex>
    </Flex>
  );
};
