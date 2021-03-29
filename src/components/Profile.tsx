import {
  Avatar,
  Badge,
  BoxProps,
  Button,
  Divider,
  Flex,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ResponsiveBar } from "@nivo/bar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { endMessage } from "src/components/utils/endMessage";
import { loader } from "src/components/utils/loader";
import { VoteButton } from "src/components/utils/VoteButton";
import {
  CommentFragment,
  useCurrentRanksQuery,
  useDownVoteCommentMutation,
  useLogoutMutation,
  UserFragment,
  useUpVoteCommentMutation,
  useUserCommentsQuery,
  useUserMemesQuery,
  useUserRanksQuery,
} from "src/generated/graphql";
import { DoubleColLayout } from "src/pages/_doubleColLayout";
import { BUCKET_BASE_URL } from "src/utils/constants";
import { ratioToColorGrade } from "src/utils/functions";
import { MemeGrid } from "./meme/MemeGrid";
dayjs.extend(relativeTime);
const take = 16;
interface ProfileProps {
  user: UserFragment;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [, logoutFN] = useLogoutMutation();
  const [isMemes, setIsMemes] = useState(true);
  const [order, setOrder] = useState("new");
  return (
    <DoubleColLayout>
      <Flex direction="column">
        <Flex m={2} p={2} justify="space-between">
          <Text>Profile</Text>
          <Image
            _hover={{ cursor: "pointer" }}
            onClick={() => logoutFN()}
            height="20px"
            src={BUCKET_BASE_URL + "/icons/logout.png"}
          />
        </Flex>
        <Flex justifyContent="center">
          <Divider w="95%" />
        </Flex>
        <Flex py={2} direction="column" alignItems="center">
          <Flex
            mr={4}
            my={2}
            justifyContent="centerr"
            alignItems="center"
            direction="column"
          >
            <Avatar src={user.avatar} size="xl" />
            <Text textAlign="center" py={2} fontWeight="bold" fontSize="20px">
              {user.username}
            </Text>
          </Flex>
          <RankScoreTable user={user} />
        </Flex>
        <Flex w="95%" mb={4}>
          <Divider />
        </Flex>
        <Flex justifyContent="space-around">
          <Flex>
            <Button mr={4} onClick={() => setIsMemes(true)}>
              Memes
            </Button>
            <Button onClick={() => setIsMemes(false)}>comments</Button>
          </Flex>
          <Flex>
            <Button onClick={() => setOrder("ratio")} mr={4}>
              Top Ratio
            </Button>
            <Button onClick={() => setOrder("upvoted")} mr={4}>
              Top Upvoted
            </Button>
            <Button onClick={() => setOrder("new")}>New</Button>
          </Flex>
        </Flex>
        {isMemes ? (
          <Memes user={user} order={order} />
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
    variables: { userId: user.id, order, skip, take: 16 },
  });
  const loadMore = () => setSkip(skip + take);
  if (error) console.log("error", error);
  if (!data || fetching || !data.userMemes) {
    return (
      <DoubleColLayout>
        <Text>Loading ...</Text>
      </DoubleColLayout>
    );
  }
  const { hasMore, items: memes } = data.userMemes;
  return (
    <MemeGrid
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
    return <></>;
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
      <Stack py={6} px={12}>
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

type CommentBoxProps = BoxProps & {
  comment: CommentFragment;
};

export const CommentBox: React.FC<CommentBoxProps> = (props) => {
  let { comment } = props;
  const router = useRouter();
  const [
    { fetching: upFetching },
    upVoteCommentFN,
  ] = useUpVoteCommentMutation();
  const [
    { fetching: downFetching },
    downVoteCommentFN,
  ] = useDownVoteCommentMutation();
  const toast = useToast();
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
      const { data, error } = await upVoteCommentFN({ commentId: comment.id });
      if (error) console.log("errror", error);
      if (data?.upVoteComment) {
        comment = data?.upVoteComment;
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
    <Flex
      justifyContent="space-between"
      align="center"
      {...props}
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
        <VoteButton
          upvote
          numVotes={comment.ups}
          hasVoted={comment.hasUpvoted}
          handleVote={handleUpvote}
          fetching={upFetching}
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
    </Flex>
  );
};

interface RankScoreTableProps {
  user: UserFragment;
}

const RankScoreTable: React.FC<RankScoreTableProps> = ({ user }) => {
  const [{ fetching, error, data }] = useCurrentRanksQuery({
    variables: { userId: user.id },
  });
  if (error) console.log(error);
  if (fetching || !data) return <></>;
  const extractRank = (timeFrame: string) =>
    data?.currentRanks.filter((rank) => rank.timeFrame === timeFrame)[0].rank;
  const extractScore = (timeFrame: string) =>
    data?.currentRanks.filter((rank) => rank.timeFrame === timeFrame)[0].mhp;
  return (
    <Flex
      w="100%"
      h="150px"
      alignItems="center"
      pl={4}
      justifyContent="space-around"
    >
      <Flex mr={6}>
        <Stack mr={4}>
          <Badge textAlign="center">Rank</Badge>
          <Badge textAlign="center">Day: {extractRank("day")}</Badge>
          <Badge textAlign="center">Week: {extractRank("week")}</Badge>
          <Badge textAlign="center">Month: {extractRank("month")}</Badge>
          <Badge textAlign="center">Ever: {extractRank("ever")}</Badge>
        </Stack>
        <Stack mr={4}>
          <Badge textAlign="center">Score</Badge>
          <Badge textAlign="center">Day: {extractScore("day")}</Badge>
          <Badge textAlign="center">Week: {extractScore("week")}</Badge>
          <Badge textAlign="center">Month: {extractScore("month")}</Badge>
          <Badge textAlign="center">Ever: {extractScore("ever")}</Badge>
        </Stack>
      </Flex>

      <WeeklyPL userId={user.id} />
    </Flex>
  );
};

interface weeklyPLProps {
  userId: string;
}

const WeeklyPL: React.FC<weeklyPLProps> = ({ userId }) => {
  const [{ fetching, data, error }] = useUserRanksQuery({
    variables: { num: 8, userId, timeFrame: "ever" },
  });
  if (error) console.log(error);
  if (fetching || !data) return <></>;
  const { userRanks } = data;
  const points_days = Array.from(Array(userRanks.length - 1).keys()).map(
    (idx) => {
      return {
        points: userRanks[idx + 1].mhp - userRanks[idx].mhp,
        day: new Date(userRanks[idx + 1].createdAt).getDate(),
      };
    }
  );
  const tickValues = [...new Set(points_days.map((item) => item.points))];
  return (
    <ResponsiveBar
      data={points_days}
      keys={["points"]}
      indexBy="day"
      theme={{ textColor: "#eee" }}
      margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      colors={(data: any) => {
        return data.value >= 0 ? "green" : "red";
      }}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Past Week",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      gridYValues={tickValues.length >= 5 ? 5 : tickValues.length}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        tickValues: tickValues.length >= 5 ? 5 : tickValues.length,
        legend: "MHP P/L",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  );
};
