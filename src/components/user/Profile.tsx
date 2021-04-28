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
  Tooltip,
} from "@chakra-ui/react";
import { ResponsiveBar } from "@nivo/bar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Humanize from "humanize-plus";
import { useRouter } from "next/router";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { loader } from "src/components/utils/loader";
import {
  CommentFragment,
  useCurrentRanksQuery,
  UserFragment,
  useUserCommentsQuery,
  useUserMemesQuery,
  useUserRanksQuery,
} from "src/generated/graphql";
import { DoubleColLayout } from "src/pages/_doubleColLayout";
import { capitalizeFirstLetter, ratioToColorGrade } from "src/utils/functions";
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
          <RankScoreTable user={user} isMhp={true} />
          <Flex alignItems="center" direction="column">
            <Avatar src={user.avatar} size="xl" />
            <Text textAlign="center" py={2} fontWeight="bold" fontSize="20px">
              {user.username}
            </Text>
            <Flex justifyContent="center">
              <Button
                onClick={() => router.push(`/user/portfolio/${user.id}`)}
                mr={2}
              >
                Portfolio
              </Button>
              <Button onClick={() => router.push(`/user/wallet/${user.id}`)}>
                Wallet
              </Button>
            </Flex>
          </Flex>
          <RankScoreTable user={user} isMhp={false} />
        </Flex>
        <Flex
          mt={4}
          mx={6}
          h="150px"
          alignItems="center"
          justifyContent="space-around"
        >
          <Flex h="150px" w="45%" mx={2}>
            <WeeklyPL isMhp={true} userId={user.id} />
          </Flex>
          <Flex h="150px" w="45%" mx={2}>
            <WeeklyPL isMhp={false} userId={user.id} />
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

type CommentBoxProps = BoxProps & {
  comment: CommentFragment;
};

export const CommentBox: React.FC<CommentBoxProps> = (props) => {
  let { comment } = props;
  const router = useRouter();
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

interface BadgeItemProps {
  timeframe: string;
  extract: (timeframe: string) => number;
}
const BadgeItem: React.FC<BadgeItemProps> = ({ timeframe, extract }) => (
  <Tooltip hasArrow label={`${extract(timeframe)}`}>
    <Badge _hover={{ pointer: "cursor" }} textAlign="center">
      {capitalizeFirstLetter(timeframe)}:{" "}
      {Humanize.compactInteger(extract(timeframe))}
    </Badge>
  </Tooltip>
);

interface RankScoreTableProps {
  user: UserFragment;
  isMhp: boolean;
}

const RankScoreTable: React.FC<RankScoreTableProps> = ({ user, isMhp }) => {
  const [{ fetching, error, data }] = useCurrentRanksQuery({
    variables: { userId: user.id },
  });
  if (error) console.log(error);
  if (fetching || !data) return <></>;

  const extractRank = isMhp
    ? (timeFrame: string) =>
        data?.currentRanks.filter((rank) => rank.timeFrame === timeFrame)[0]
          .mhpRank
    : (timeFrame: string) =>
        data?.currentRanks.filter((rank) => rank.timeFrame === timeFrame)[0]
          .gbpRank;
  const extractScore = isMhp
    ? (timeFrame: string) =>
        data?.currentRanks.filter((rank) => rank.timeFrame === timeFrame)[0].mhp
    : (timeFrame: string) =>
        data?.currentRanks.filter((rank) => rank.timeFrame === timeFrame)[0]
          .gbp;

  return (
    <Flex
      px={6}
      direction="column"
      w="100%"
      justify="center"
      alignItems="center"
    >
      <Flex direction="column">
        <Flex justifyContent="center">
          <Text fontWeight="bold">{isMhp ? "MHP" : "GBP"}</Text>
        </Flex>
        <Flex>
          <Stack mr={2} justifyContent="center">
            <Badge textAlign="center">Rank</Badge>
            <BadgeItem timeframe="day" extract={extractRank} />
            <BadgeItem timeframe="week" extract={extractRank} />
            <BadgeItem timeframe="month" extract={extractRank} />
            <BadgeItem timeframe="ever" extract={extractRank} />
          </Stack>
          <Stack>
            <Badge textAlign="center">Amount</Badge>
            <BadgeItem timeframe="day" extract={extractScore} />
            <BadgeItem timeframe="week" extract={extractScore} />
            <BadgeItem timeframe="month" extract={extractScore} />
            <BadgeItem timeframe="ever" extract={extractScore} />
          </Stack>
        </Flex>
      </Flex>
    </Flex>
  );
};

interface weeklyPLProps {
  userId: string;
  isMhp: boolean;
}

const WeeklyPL: React.FC<weeklyPLProps> = ({ userId, isMhp }) => {
  const [{ fetching, data, error }] = useUserRanksQuery({
    variables: { num: 8, userId, timeFrame: "ever" },
  });
  if (error) console.log(error);
  if (fetching || !data) return <></>;
  const { userRanks } = data;
  const points_days = isMhp
    ? Array.from(Array(userRanks.length - 1).keys()).map((idx) => {
        return {
          points: userRanks[idx + 1].mhp - userRanks[idx].mhp,
          day: new Date(userRanks[idx + 1].createdAt).getDate(),
        };
      })
    : Array.from(Array(userRanks.length - 1).keys()).map((idx) => {
        return {
          points: userRanks[idx + 1].gbp - userRanks[idx].gbp,
          day: new Date(userRanks[idx + 1].createdAt).getDate(),
        };
      });
  const tickValues = [...new Set(points_days.map((item) => item.points))];
  return (
    <ResponsiveBar
      data={points_days}
      keys={["points"]}
      indexBy="day"
      theme={{ textColor: "#eee" }}
      margin={{ top: 10, right: 10, bottom: 50, left: 50 }}
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
        legend: `${isMhp ? "MHP " : "GBP "} P/L`,
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
