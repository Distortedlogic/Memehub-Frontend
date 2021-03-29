import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  countGraph: Array<Scalars['Int']>;
  redditMaxTimestamp: Scalars['String'];
  comments: PaginatedComments;
  myComments: PaginatedComments;
  userComments: PaginatedComments;
  emojis: Array<Emoji>;
  myMemes?: Maybe<PaginatedMemes>;
  userMemes?: Maybe<PaginatedMemes>;
  meme?: Maybe<Meme>;
  newMemes: PaginatedMemes;
  topRatedMemes: PaginatedMemes;
  hotMemes: PaginatedMemes;
  userRanks: Array<Rank>;
  currentRanks: Array<Rank>;
  ranking: PaginatedRanks;
  bestOfReddit: PaginatedRedditMemes;
  stonks: PaginatedStonks;
  users: Array<User>;
  me?: Maybe<User>;
  user?: Maybe<User>;
  isHive: Scalars['Boolean'];
};


export type QueryCountGraphArgs = {
  entityType: Scalars['String'];
  aggro: Scalars['String'];
  timeframe: Scalars['String'];
  ticks: Scalars['Int'];
};


export type QueryCommentsArgs = {
  order: Scalars['String'];
  skip: Scalars['Int'];
  take: Scalars['Int'];
  memeId: Scalars['String'];
};


export type QueryMyCommentsArgs = {
  order: Scalars['String'];
  skip: Scalars['Int'];
  take: Scalars['Int'];
};


export type QueryUserCommentsArgs = {
  order: Scalars['String'];
  skip: Scalars['Int'];
  take: Scalars['Int'];
  userId: Scalars['String'];
};


export type QueryMyMemesArgs = {
  order: Scalars['String'];
  skip: Scalars['Int'];
  take: Scalars['Int'];
};


export type QueryUserMemesArgs = {
  order: Scalars['String'];
  skip: Scalars['Int'];
  take: Scalars['Int'];
  userId: Scalars['String'];
};


export type QueryMemeArgs = {
  memeId: Scalars['String'];
};


export type QueryNewMemesArgs = {
  cursor?: Maybe<Scalars['String']>;
  take: Scalars['Int'];
};


export type QueryTopRatedMemesArgs = {
  skip: Scalars['Int'];
  days: Scalars['Int'];
  take: Scalars['Int'];
};


export type QueryHotMemesArgs = {
  skip?: Maybe<Scalars['Int']>;
  take: Scalars['Int'];
};


export type QueryUserRanksArgs = {
  timeFrame?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  num?: Maybe<Scalars['Int']>;
};


export type QueryCurrentRanksArgs = {
  userId?: Maybe<Scalars['String']>;
};


export type QueryRankingArgs = {
  timeFrame: Scalars['String'];
  skip: Scalars['Int'];
  take: Scalars['Int'];
};


export type QueryBestOfRedditArgs = {
  skip: Scalars['Int'];
  take: Scalars['Int'];
};


export type QueryStonksArgs = {
  order: Scalars['String'];
  skip: Scalars['Int'];
  take: Scalars['Int'];
};


export type QueryUserArgs = {
  userId: Scalars['String'];
};

export type PaginatedComments = {
  __typename?: 'PaginatedComments';
  items: Array<Comment>;
  hasMore: Scalars['Boolean'];
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['String'];
  text: Scalars['String'];
  isHive: Scalars['Boolean'];
  permlink?: Maybe<Scalars['String']>;
  userId: Scalars['String'];
  user: User;
  memeId: Scalars['String'];
  meme: Meme;
  commentVotes: Array<CommentVote>;
  ups: Scalars['Int'];
  downs: Scalars['Int'];
  ratio: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  hasUpvoted: Scalars['Boolean'];
  hasDownvoted: Scalars['Boolean'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  isHive: Scalars['Boolean'];
  verified: Scalars['Boolean'];
  email: Scalars['String'];
  username: Scalars['String'];
  avatar: Scalars['String'];
  trades: Array<Trade>;
  memes: Array<Meme>;
  comments: Array<Comment>;
  memeVotes: Array<MemeVote>;
  commentVotes: Array<CommentVote>;
  rank: Rank;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  numMemeVotesGiven: Scalars['Int'];
  numMemeUpvotesRecieved: Scalars['Int'];
  numMemeDownvotesRecieved: Scalars['Int'];
  numMemeCommentsRecieved: Scalars['Int'];
  numCommentVotesGiven: Scalars['Int'];
  numCommentUpvotesRecieved: Scalars['Int'];
  numCommentDownvotesRecieved: Scalars['Int'];
  mhp: Scalars['Int'];
  gbp: Scalars['Int'];
};

export type Trade = {
  __typename?: 'Trade';
  id: Scalars['String'];
  name: Scalars['String'];
  entry: Scalars['Float'];
  exit: Scalars['Float'];
  user: User;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};


export type Meme = {
  __typename?: 'Meme';
  id: Scalars['String'];
  isHive: Scalars['Boolean'];
  title: Scalars['String'];
  ocrText: Scalars['String'];
  url: Scalars['String'];
  userId: Scalars['String'];
  memeClf: Scalars['String'];
  memeClfCorrect: Scalars['Boolean'];
  version: Scalars['String'];
  user: User;
  season: Scalars['Int'];
  comments: Array<Comment>;
  numComments: Scalars['Int'];
  memeVotes: Array<MemeVote>;
  ups: Scalars['Int'];
  downs: Scalars['Int'];
  ratio: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  hasUpvoted: Scalars['Boolean'];
  hasDownvoted: Scalars['Boolean'];
};

export type MemeVote = {
  __typename?: 'MemeVote';
  userId: Scalars['Int'];
  memeId: Scalars['Int'];
  meme: Meme;
  user: User;
  upvote: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
};

export type CommentVote = {
  __typename?: 'CommentVote';
  userId: Scalars['Int'];
  user: User;
  commentId: Scalars['Int'];
  comment: Comment;
  upvote: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
};

export type Rank = {
  __typename?: 'Rank';
  createdAt: Scalars['DateTime'];
  userId: Scalars['String'];
  timeFrame: Scalars['String'];
  user: User;
  rank: Scalars['Int'];
  mhp: Scalars['Int'];
};

export type Emoji = {
  __typename?: 'Emoji';
  name: Scalars['String'];
  url: Scalars['String'];
  createdAt: Scalars['DateTime'];
};

export type PaginatedMemes = {
  __typename?: 'PaginatedMemes';
  items: Array<Meme>;
  hasMore: Scalars['Boolean'];
};

export type PaginatedRanks = {
  __typename?: 'PaginatedRanks';
  items: Array<Rank>;
  hasMore: Scalars['Boolean'];
};

export type PaginatedRedditMemes = {
  __typename?: 'PaginatedRedditMemes';
  items: Array<RedditMeme>;
  hasMore: Scalars['Boolean'];
};

export type RedditMeme = {
  __typename?: 'RedditMeme';
  id: Scalars['Int'];
  username: Scalars['String'];
  subreddit: Scalars['String'];
  title: Scalars['String'];
  url: Scalars['String'];
  memeText: Scalars['String'];
  isATemplate: Scalars['Boolean'];
  memeClf: Scalars['String'];
  memeClfCorrect: Scalars['Boolean'];
  stonk: Scalars['Boolean'];
  stonkCorrect: Scalars['Boolean'];
  version: Scalars['String'];
  timestamp: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  upvoteRatio: Scalars['Float'];
  upvotes: Scalars['Int'];
  downvotes: Scalars['Int'];
  numComments: Scalars['Int'];
  redditorId: Scalars['Int'];
  redditor: Redditor;
};

export type Redditor = {
  __typename?: 'Redditor';
  id: Scalars['Int'];
  username: Scalars['String'];
};

export type PaginatedStonks = {
  __typename?: 'PaginatedStonks';
  items: Array<Stonk>;
  hasMore: Scalars['Boolean'];
};

export type Stonk = {
  __typename?: 'Stonk';
  name: Scalars['String'];
  url: Scalars['String'];
  price: Scalars['Float'];
  marketcap: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  memeClf: Scalars['String'];
  postComment: Comment;
  setCommentIsHive: Scalars['Boolean'];
  upVoteComment: Comment;
  downVoteComment: Comment;
  getSignedUrl: Scalars['String'];
  deleteMeme: Scalars['Boolean'];
  postMeme?: Maybe<Meme>;
  setMemeIsHive: Scalars['Boolean'];
  upVoteMeme: Meme;
  downVoteMeme: Meme;
  redisGet: Scalars['String'];
  hiveLogin: UserResponse;
  login?: Maybe<UserResponse>;
  logout: Scalars['Boolean'];
  createHiveAcct: Scalars['Boolean'];
  register: UserResponse;
  verifyEmail: Scalars['Boolean'];
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
};


export type MutationMemeClfArgs = {
  url: Scalars['String'];
};


export type MutationPostCommentArgs = {
  memeId: Scalars['String'];
  text: Scalars['String'];
};


export type MutationSetCommentIsHiveArgs = {
  permlink: Scalars['String'];
  commentId: Scalars['String'];
};


export type MutationUpVoteCommentArgs = {
  commentId: Scalars['String'];
};


export type MutationDownVoteCommentArgs = {
  commentId: Scalars['String'];
};


export type MutationGetSignedUrlArgs = {
  filename: Scalars['String'];
  path: Scalars['String'];
};


export type MutationDeleteMemeArgs = {
  memeId: Scalars['String'];
};


export type MutationPostMemeArgs = {
  title: Scalars['String'];
  postToHive: Scalars['Boolean'];
};


export type MutationSetMemeIsHiveArgs = {
  memeId: Scalars['String'];
};


export type MutationUpVoteMemeArgs = {
  memeId: Scalars['String'];
};


export type MutationDownVoteMemeArgs = {
  memeId: Scalars['String'];
};


export type MutationRedisGetArgs = {
  key: Scalars['String'];
};


export type MutationHiveLoginArgs = {
  signedMessage: Scalars['String'];
  message: Scalars['String'];
  username: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationCreateHiveAcctArgs = {
  password: Scalars['String'];
  new_account_name: Scalars['String'];
};


export type MutationRegisterArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newComments: Comment;
};


export type SubscriptionNewCommentsArgs = {
  userId: Scalars['String'];
};

export type RedditScore = {
  __typename?: 'RedditScore';
  id: Scalars['Int'];
  username: Scalars['String'];
  subreddit: Scalars['String'];
  timeDelta: Scalars['Int'];
  timestamp: Scalars['Int'];
  datetime: Scalars['DateTime'];
  finalScore: Scalars['Float'];
  rawScore: Scalars['Float'];
  numInBottom: Scalars['Int'];
  numInTop: Scalars['Int'];
  shitposterIndex: Scalars['Float'];
  highestUpvotes: Scalars['Int'];
  huScore: Scalars['Float'];
  lowestRatio: Scalars['Float'];
  redditorId: Scalars['Int'];
};

export type Market = {
  __typename?: 'Market';
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  source: Scalars['String'];
  subsource: Scalars['String'];
  numPosts: Scalars['Int'];
  numUpvotes: Scalars['Int'];
};

export type Template = {
  __typename?: 'Template';
  name: Scalars['String'];
  url: Scalars['String'];
};

export type RedditMaxTimestampQueryVariables = Exact<{ [key: string]: never; }>;


export type RedditMaxTimestampQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'redditMaxTimestamp'>
);

export type CountGraphQueryVariables = Exact<{
  ticks: Scalars['Int'];
  timeframe: Scalars['String'];
  aggro: Scalars['String'];
  entityType: Scalars['String'];
}>;


export type CountGraphQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'countGraph'>
);

export type MemeClfMutationVariables = Exact<{
  url: Scalars['String'];
}>;


export type MemeClfMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'memeClf'>
);

export type MyCommentFragment = (
  { __typename?: 'Comment' }
  & Pick<Comment, 'id' | 'ups' | 'downs' | 'ratio' | 'createdAt' | 'text' | 'isHive' | 'permlink'>
  & { meme: (
    { __typename?: 'Meme' }
    & Pick<Meme, 'url' | 'id'>
  ) }
);

export type CommentFragment = (
  { __typename?: 'Comment' }
  & Pick<Comment, 'hasUpvoted' | 'hasDownvoted'>
  & MyCommentFragment
);

export type UserCommentFragment = (
  { __typename?: 'Comment' }
  & { user: (
    { __typename?: 'User' }
    & UserFragment
  ) }
  & CommentFragment
);

export type PostCommentMutationVariables = Exact<{
  text: Scalars['String'];
  memeId: Scalars['String'];
}>;


export type PostCommentMutation = (
  { __typename?: 'Mutation' }
  & { postComment: (
    { __typename?: 'Comment' }
    & MyCommentFragment
  ) }
);

export type SetCommentIsHiveMutationVariables = Exact<{
  commentId: Scalars['String'];
  permlink: Scalars['String'];
}>;


export type SetCommentIsHiveMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'setCommentIsHive'>
);

export type UpVoteCommentMutationVariables = Exact<{
  commentId: Scalars['String'];
}>;


export type UpVoteCommentMutation = (
  { __typename?: 'Mutation' }
  & { upVoteComment: (
    { __typename?: 'Comment' }
    & UserCommentFragment
  ) }
);

export type DownVoteCommentMutationVariables = Exact<{
  commentId: Scalars['String'];
}>;


export type DownVoteCommentMutation = (
  { __typename?: 'Mutation' }
  & { downVoteComment: (
    { __typename?: 'Comment' }
    & UserCommentFragment
  ) }
);

export type CommentsQueryVariables = Exact<{
  memeId: Scalars['String'];
  skip: Scalars['Int'];
  take: Scalars['Int'];
  order: Scalars['String'];
}>;


export type CommentsQuery = (
  { __typename?: 'Query' }
  & { comments: (
    { __typename?: 'PaginatedComments' }
    & Pick<PaginatedComments, 'hasMore'>
    & { items: Array<(
      { __typename?: 'Comment' }
      & UserCommentFragment
    )> }
  ) }
);

export type UserCommentsQueryVariables = Exact<{
  userId: Scalars['String'];
  skip: Scalars['Int'];
  take: Scalars['Int'];
  order: Scalars['String'];
}>;


export type UserCommentsQuery = (
  { __typename?: 'Query' }
  & { userComments: (
    { __typename?: 'PaginatedComments' }
    & Pick<PaginatedComments, 'hasMore'>
    & { items: Array<(
      { __typename?: 'Comment' }
      & CommentFragment
    )> }
  ) }
);

export type MyCommentsQueryVariables = Exact<{
  skip: Scalars['Int'];
  take: Scalars['Int'];
  order: Scalars['String'];
}>;


export type MyCommentsQuery = (
  { __typename?: 'Query' }
  & { myComments: (
    { __typename?: 'PaginatedComments' }
    & Pick<PaginatedComments, 'hasMore'>
    & { items: Array<(
      { __typename?: 'Comment' }
      & MyCommentFragment
    )> }
  ) }
);

export type NewCommentsSubscriptionVariables = Exact<{
  userId: Scalars['String'];
}>;


export type NewCommentsSubscription = (
  { __typename?: 'Subscription' }
  & { newComments: (
    { __typename?: 'Comment' }
    & MyCommentFragment
  ) }
);

export type EmojiFragment = (
  { __typename?: 'Emoji' }
  & Pick<Emoji, 'name' | 'url'>
);

export type EmojisQueryVariables = Exact<{ [key: string]: never; }>;


export type EmojisQuery = (
  { __typename?: 'Query' }
  & { emojis: Array<(
    { __typename?: 'Emoji' }
    & EmojiFragment
  )> }
);

export type MyMemeFragment = (
  { __typename?: 'Meme' }
  & Pick<Meme, 'id' | 'ups' | 'downs' | 'ratio' | 'createdAt' | 'title' | 'url' | 'numComments' | 'isHive'>
);

export type MemeFragment = (
  { __typename?: 'Meme' }
  & Pick<Meme, 'hasUpvoted' | 'hasDownvoted'>
  & MyMemeFragment
);

export type UserMemeFragment = (
  { __typename?: 'Meme' }
  & { user: (
    { __typename?: 'User' }
    & UserFragment
  ) }
  & MemeFragment
);

export type PostMemeMutationVariables = Exact<{
  title: Scalars['String'];
  postToHive: Scalars['Boolean'];
}>;


export type PostMemeMutation = (
  { __typename?: 'Mutation' }
  & { postMeme?: Maybe<(
    { __typename?: 'Meme' }
    & MyMemeFragment
  )> }
);

export type DeleteMemeMutationVariables = Exact<{
  memeId: Scalars['String'];
}>;


export type DeleteMemeMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteMeme'>
);

export type SetMemeIsHiveMutationVariables = Exact<{
  memeId: Scalars['String'];
}>;


export type SetMemeIsHiveMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'setMemeIsHive'>
);

export type GetSignedUrlMutationVariables = Exact<{
  path: Scalars['String'];
  filename: Scalars['String'];
}>;


export type GetSignedUrlMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'getSignedUrl'>
);

export type UpVoteMemeMutationVariables = Exact<{
  memeId: Scalars['String'];
}>;


export type UpVoteMemeMutation = (
  { __typename?: 'Mutation' }
  & { upVoteMeme: (
    { __typename?: 'Meme' }
    & UserMemeFragment
  ) }
);

export type DownVoteMemeMutationVariables = Exact<{
  memeId: Scalars['String'];
}>;


export type DownVoteMemeMutation = (
  { __typename?: 'Mutation' }
  & { downVoteMeme: (
    { __typename?: 'Meme' }
    & UserMemeFragment
  ) }
);

export type MemeQueryVariables = Exact<{
  memeId: Scalars['String'];
}>;


export type MemeQuery = (
  { __typename?: 'Query' }
  & { meme?: Maybe<(
    { __typename?: 'Meme' }
    & UserMemeFragment
  )> }
);

export type MyMemesQueryVariables = Exact<{
  take: Scalars['Int'];
  skip: Scalars['Int'];
  order: Scalars['String'];
}>;


export type MyMemesQuery = (
  { __typename?: 'Query' }
  & { myMemes?: Maybe<(
    { __typename?: 'PaginatedMemes' }
    & Pick<PaginatedMemes, 'hasMore'>
    & { items: Array<(
      { __typename?: 'Meme' }
      & MyMemeFragment
    )> }
  )> }
);

export type UserMemesQueryVariables = Exact<{
  userId: Scalars['String'];
  take: Scalars['Int'];
  skip: Scalars['Int'];
  order: Scalars['String'];
}>;


export type UserMemesQuery = (
  { __typename?: 'Query' }
  & { userMemes?: Maybe<(
    { __typename?: 'PaginatedMemes' }
    & Pick<PaginatedMemes, 'hasMore'>
    & { items: Array<(
      { __typename?: 'Meme' }
      & MemeFragment
    )> }
  )> }
);

export type NewMemesQueryVariables = Exact<{
  take: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type NewMemesQuery = (
  { __typename?: 'Query' }
  & { newMemes: (
    { __typename?: 'PaginatedMemes' }
    & Pick<PaginatedMemes, 'hasMore'>
    & { items: Array<(
      { __typename?: 'Meme' }
      & UserMemeFragment
    )> }
  ) }
);

export type HotMemesQueryVariables = Exact<{
  take: Scalars['Int'];
  skip?: Maybe<Scalars['Int']>;
}>;


export type HotMemesQuery = (
  { __typename?: 'Query' }
  & { hotMemes: (
    { __typename?: 'PaginatedMemes' }
    & Pick<PaginatedMemes, 'hasMore'>
    & { items: Array<(
      { __typename?: 'Meme' }
      & UserMemeFragment
    )> }
  ) }
);

export type TopRatedMemesQueryVariables = Exact<{
  take: Scalars['Int'];
  skip: Scalars['Int'];
  days: Scalars['Int'];
}>;


export type TopRatedMemesQuery = (
  { __typename?: 'Query' }
  & { topRatedMemes: (
    { __typename?: 'PaginatedMemes' }
    & Pick<PaginatedMemes, 'hasMore'>
    & { items: Array<(
      { __typename?: 'Meme' }
      & UserMemeFragment
    )> }
  ) }
);

export type RankFragment = (
  { __typename?: 'Rank' }
  & Pick<Rank, 'mhp' | 'rank' | 'timeFrame' | 'createdAt'>
);

export type UserRankFragment = (
  { __typename?: 'Rank' }
  & { user: (
    { __typename?: 'User' }
    & UserFragment
  ) }
  & RankFragment
);

export type UserRanksQueryVariables = Exact<{
  num: Scalars['Int'];
  userId?: Maybe<Scalars['String']>;
  timeFrame?: Maybe<Scalars['String']>;
}>;


export type UserRanksQuery = (
  { __typename?: 'Query' }
  & { userRanks: Array<(
    { __typename?: 'Rank' }
    & RankFragment
  )> }
);

export type CurrentRanksQueryVariables = Exact<{
  userId?: Maybe<Scalars['String']>;
}>;


export type CurrentRanksQuery = (
  { __typename?: 'Query' }
  & { currentRanks: Array<(
    { __typename?: 'Rank' }
    & RankFragment
  )> }
);

export type RankingQueryVariables = Exact<{
  timeFrame: Scalars['String'];
  take: Scalars['Int'];
  skip: Scalars['Int'];
}>;


export type RankingQuery = (
  { __typename?: 'Query' }
  & { ranking: (
    { __typename?: 'PaginatedRanks' }
    & Pick<PaginatedRanks, 'hasMore'>
    & { items: Array<(
      { __typename?: 'Rank' }
      & UserRankFragment
    )> }
  ) }
);

export type RedditMemeFragment = (
  { __typename?: 'RedditMeme' }
  & Pick<RedditMeme, 'id' | 'title' | 'subreddit' | 'url' | 'upvotes' | 'downvotes' | 'numComments'>
  & { redditor: (
    { __typename?: 'Redditor' }
    & Pick<Redditor, 'id' | 'username'>
  ) }
);

export type BestOfRedditQueryVariables = Exact<{
  take: Scalars['Int'];
  skip: Scalars['Int'];
}>;


export type BestOfRedditQuery = (
  { __typename?: 'Query' }
  & { bestOfReddit: (
    { __typename?: 'PaginatedRedditMemes' }
    & Pick<PaginatedRedditMemes, 'hasMore'>
    & { items: Array<(
      { __typename?: 'RedditMeme' }
      & RedditMemeFragment
    )> }
  ) }
);

export type RedisGetMutationVariables = Exact<{
  key: Scalars['String'];
}>;


export type RedisGetMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'redisGet'>
);

export type TemplateFragment = (
  { __typename?: 'Template' }
  & Pick<Template, 'name' | 'url'>
);

export type StonkFragment = (
  { __typename?: 'Stonk' }
  & Pick<Stonk, 'name' | 'url' | 'price' | 'marketcap'>
);

export type StonksQueryVariables = Exact<{
  take: Scalars['Int'];
  skip: Scalars['Int'];
  order: Scalars['String'];
}>;


export type StonksQuery = (
  { __typename?: 'Query' }
  & { stonks: (
    { __typename?: 'PaginatedStonks' }
    & Pick<PaginatedStonks, 'hasMore'>
    & { items: Array<(
      { __typename?: 'Stonk' }
      & StonkFragment
    )> }
  ) }
);

export type UserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'avatar' | 'username' | 'isHive' | 'mhp' | 'gbp'>
);

export type StatsFragment = (
  { __typename?: 'User' }
  & Pick<User, 'numMemeVotesGiven' | 'numMemeUpvotesRecieved' | 'numMemeDownvotesRecieved' | 'numMemeCommentsRecieved' | 'numCommentVotesGiven' | 'numCommentUpvotesRecieved' | 'numCommentDownvotesRecieved'>
);

export type UserProfileFragment = (
  { __typename?: 'User' }
  & UserFragment
  & StatsFragment
);

export type UserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & ErrorsFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & UserFragment
  )> }
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & UserResponseFragment
  ) }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type VerifyEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'verifyEmail'>
);

export type CreateHiveAcctMutationVariables = Exact<{
  new_account_name: Scalars['String'];
  password: Scalars['String'];
}>;


export type CreateHiveAcctMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'createHiveAcct'>
);

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & UserResponseFragment
  ) }
);

export type HiveLoginMutationVariables = Exact<{
  message: Scalars['String'];
  signedMessage: Scalars['String'];
  username: Scalars['String'];
}>;


export type HiveLoginMutation = (
  { __typename?: 'Mutation' }
  & { hiveLogin: (
    { __typename?: 'UserResponse' }
    & UserResponseFragment
  ) }
);

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login?: Maybe<(
    { __typename?: 'UserResponse' }
    & UserResponseFragment
  )> }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & UserFragment
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & UserFragment
  )> }
);

export type UserProfileQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type UserProfileQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & UserProfileFragment
  )> }
);

export type MyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type MyProfileQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & UserProfileFragment
  )> }
);

export type IsHiveQueryVariables = Exact<{ [key: string]: never; }>;


export type IsHiveQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'isHive'>
);

export type ErrorsFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export const MyCommentFragmentDoc = gql`
    fragment myComment on Comment {
  id
  ups
  downs
  ratio
  createdAt
  text
  isHive
  permlink
  meme {
    url
    id
  }
}
    `;
export const CommentFragmentDoc = gql`
    fragment comment on Comment {
  ...myComment
  hasUpvoted
  hasDownvoted
}
    ${MyCommentFragmentDoc}`;
export const UserFragmentDoc = gql`
    fragment user on User {
  id
  avatar
  username
  isHive
  mhp
  gbp
}
    `;
export const UserCommentFragmentDoc = gql`
    fragment userComment on Comment {
  ...comment
  user {
    ...user
  }
}
    ${CommentFragmentDoc}
${UserFragmentDoc}`;
export const EmojiFragmentDoc = gql`
    fragment emoji on Emoji {
  name
  url
}
    `;
export const MyMemeFragmentDoc = gql`
    fragment myMeme on Meme {
  id
  ups
  downs
  ratio
  createdAt
  title
  url
  numComments
  isHive
}
    `;
export const MemeFragmentDoc = gql`
    fragment meme on Meme {
  ...myMeme
  hasUpvoted
  hasDownvoted
}
    ${MyMemeFragmentDoc}`;
export const UserMemeFragmentDoc = gql`
    fragment userMeme on Meme {
  ...meme
  user {
    ...user
  }
}
    ${MemeFragmentDoc}
${UserFragmentDoc}`;
export const RankFragmentDoc = gql`
    fragment rank on Rank {
  mhp
  rank
  timeFrame
  createdAt
}
    `;
export const UserRankFragmentDoc = gql`
    fragment userRank on Rank {
  user {
    ...user
  }
  ...rank
}
    ${UserFragmentDoc}
${RankFragmentDoc}`;
export const RedditMemeFragmentDoc = gql`
    fragment redditMeme on RedditMeme {
  id
  title
  subreddit
  url
  upvotes
  downvotes
  numComments
  redditor {
    id
    username
  }
}
    `;
export const TemplateFragmentDoc = gql`
    fragment template on Template {
  name
  url
}
    `;
export const StonkFragmentDoc = gql`
    fragment stonk on Stonk {
  name
  url
  price
  marketcap
}
    `;
export const StatsFragmentDoc = gql`
    fragment stats on User {
  numMemeVotesGiven
  numMemeUpvotesRecieved
  numMemeDownvotesRecieved
  numMemeCommentsRecieved
  numCommentVotesGiven
  numCommentUpvotesRecieved
  numCommentDownvotesRecieved
}
    `;
export const UserProfileFragmentDoc = gql`
    fragment userProfile on User {
  ...user
  ...stats
}
    ${UserFragmentDoc}
${StatsFragmentDoc}`;
export const ErrorsFragmentDoc = gql`
    fragment errors on FieldError {
  field
  message
}
    `;
export const UserResponseFragmentDoc = gql`
    fragment userResponse on UserResponse {
  errors {
    ...errors
  }
  user {
    ...user
  }
}
    ${ErrorsFragmentDoc}
${UserFragmentDoc}`;
export const RedditMaxTimestampDocument = gql`
    query RedditMaxTimestamp {
  redditMaxTimestamp
}
    `;

export function useRedditMaxTimestampQuery(options: Omit<Urql.UseQueryArgs<RedditMaxTimestampQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<RedditMaxTimestampQuery>({ query: RedditMaxTimestampDocument, ...options });
};
export const CountGraphDocument = gql`
    query CountGraph($ticks: Int!, $timeframe: String!, $aggro: String!, $entityType: String!) {
  countGraph(
    ticks: $ticks
    timeframe: $timeframe
    aggro: $aggro
    entityType: $entityType
  )
}
    `;

export function useCountGraphQuery(options: Omit<Urql.UseQueryArgs<CountGraphQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CountGraphQuery>({ query: CountGraphDocument, ...options });
};
export const MemeClfDocument = gql`
    mutation MemeClf($url: String!) {
  memeClf(url: $url)
}
    `;

export function useMemeClfMutation() {
  return Urql.useMutation<MemeClfMutation, MemeClfMutationVariables>(MemeClfDocument);
};
export const PostCommentDocument = gql`
    mutation PostComment($text: String!, $memeId: String!) {
  postComment(text: $text, memeId: $memeId) {
    ...myComment
  }
}
    ${MyCommentFragmentDoc}`;

export function usePostCommentMutation() {
  return Urql.useMutation<PostCommentMutation, PostCommentMutationVariables>(PostCommentDocument);
};
export const SetCommentIsHiveDocument = gql`
    mutation SetCommentIsHive($commentId: String!, $permlink: String!) {
  setCommentIsHive(commentId: $commentId, permlink: $permlink)
}
    `;

export function useSetCommentIsHiveMutation() {
  return Urql.useMutation<SetCommentIsHiveMutation, SetCommentIsHiveMutationVariables>(SetCommentIsHiveDocument);
};
export const UpVoteCommentDocument = gql`
    mutation UpVoteComment($commentId: String!) {
  upVoteComment(commentId: $commentId) {
    ...userComment
  }
}
    ${UserCommentFragmentDoc}`;

export function useUpVoteCommentMutation() {
  return Urql.useMutation<UpVoteCommentMutation, UpVoteCommentMutationVariables>(UpVoteCommentDocument);
};
export const DownVoteCommentDocument = gql`
    mutation DownVoteComment($commentId: String!) {
  downVoteComment(commentId: $commentId) {
    ...userComment
  }
}
    ${UserCommentFragmentDoc}`;

export function useDownVoteCommentMutation() {
  return Urql.useMutation<DownVoteCommentMutation, DownVoteCommentMutationVariables>(DownVoteCommentDocument);
};
export const CommentsDocument = gql`
    query Comments($memeId: String!, $skip: Int!, $take: Int!, $order: String!) {
  comments(memeId: $memeId, skip: $skip, take: $take, order: $order) {
    items {
      ...userComment
    }
    hasMore
  }
}
    ${UserCommentFragmentDoc}`;

export function useCommentsQuery(options: Omit<Urql.UseQueryArgs<CommentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CommentsQuery>({ query: CommentsDocument, ...options });
};
export const UserCommentsDocument = gql`
    query UserComments($userId: String!, $skip: Int!, $take: Int!, $order: String!) {
  userComments(userId: $userId, skip: $skip, take: $take, order: $order) {
    items {
      ...comment
    }
    hasMore
  }
}
    ${CommentFragmentDoc}`;

export function useUserCommentsQuery(options: Omit<Urql.UseQueryArgs<UserCommentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserCommentsQuery>({ query: UserCommentsDocument, ...options });
};
export const MyCommentsDocument = gql`
    query MyComments($skip: Int!, $take: Int!, $order: String!) {
  myComments(skip: $skip, take: $take, order: $order) {
    items {
      ...myComment
    }
    hasMore
  }
}
    ${MyCommentFragmentDoc}`;

export function useMyCommentsQuery(options: Omit<Urql.UseQueryArgs<MyCommentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyCommentsQuery>({ query: MyCommentsDocument, ...options });
};
export const NewCommentsDocument = gql`
    subscription NewComments($userId: String!) {
  newComments(userId: $userId) {
    ...myComment
  }
}
    ${MyCommentFragmentDoc}`;

export function useNewCommentsSubscription<TData = NewCommentsSubscription>(options: Omit<Urql.UseSubscriptionArgs<NewCommentsSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<NewCommentsSubscription, TData>) {
  return Urql.useSubscription<NewCommentsSubscription, TData, NewCommentsSubscriptionVariables>({ query: NewCommentsDocument, ...options }, handler);
};
export const EmojisDocument = gql`
    query Emojis {
  emojis {
    ...emoji
  }
}
    ${EmojiFragmentDoc}`;

export function useEmojisQuery(options: Omit<Urql.UseQueryArgs<EmojisQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<EmojisQuery>({ query: EmojisDocument, ...options });
};
export const PostMemeDocument = gql`
    mutation PostMeme($title: String!, $postToHive: Boolean!) {
  postMeme(title: $title, postToHive: $postToHive) {
    ...myMeme
  }
}
    ${MyMemeFragmentDoc}`;

export function usePostMemeMutation() {
  return Urql.useMutation<PostMemeMutation, PostMemeMutationVariables>(PostMemeDocument);
};
export const DeleteMemeDocument = gql`
    mutation DeleteMeme($memeId: String!) {
  deleteMeme(memeId: $memeId)
}
    `;

export function useDeleteMemeMutation() {
  return Urql.useMutation<DeleteMemeMutation, DeleteMemeMutationVariables>(DeleteMemeDocument);
};
export const SetMemeIsHiveDocument = gql`
    mutation SetMemeIsHive($memeId: String!) {
  setMemeIsHive(memeId: $memeId)
}
    `;

export function useSetMemeIsHiveMutation() {
  return Urql.useMutation<SetMemeIsHiveMutation, SetMemeIsHiveMutationVariables>(SetMemeIsHiveDocument);
};
export const GetSignedUrlDocument = gql`
    mutation GetSignedUrl($path: String!, $filename: String!) {
  getSignedUrl(path: $path, filename: $filename)
}
    `;

export function useGetSignedUrlMutation() {
  return Urql.useMutation<GetSignedUrlMutation, GetSignedUrlMutationVariables>(GetSignedUrlDocument);
};
export const UpVoteMemeDocument = gql`
    mutation UpVoteMeme($memeId: String!) {
  upVoteMeme(memeId: $memeId) {
    ...userMeme
  }
}
    ${UserMemeFragmentDoc}`;

export function useUpVoteMemeMutation() {
  return Urql.useMutation<UpVoteMemeMutation, UpVoteMemeMutationVariables>(UpVoteMemeDocument);
};
export const DownVoteMemeDocument = gql`
    mutation DownVoteMeme($memeId: String!) {
  downVoteMeme(memeId: $memeId) {
    ...userMeme
  }
}
    ${UserMemeFragmentDoc}`;

export function useDownVoteMemeMutation() {
  return Urql.useMutation<DownVoteMemeMutation, DownVoteMemeMutationVariables>(DownVoteMemeDocument);
};
export const MemeDocument = gql`
    query Meme($memeId: String!) {
  meme(memeId: $memeId) {
    ...userMeme
  }
}
    ${UserMemeFragmentDoc}`;

export function useMemeQuery(options: Omit<Urql.UseQueryArgs<MemeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MemeQuery>({ query: MemeDocument, ...options });
};
export const MyMemesDocument = gql`
    query MyMemes($take: Int!, $skip: Int!, $order: String!) {
  myMemes(take: $take, skip: $skip, order: $order) {
    items {
      ...myMeme
    }
    hasMore
  }
}
    ${MyMemeFragmentDoc}`;

export function useMyMemesQuery(options: Omit<Urql.UseQueryArgs<MyMemesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyMemesQuery>({ query: MyMemesDocument, ...options });
};
export const UserMemesDocument = gql`
    query UserMemes($userId: String!, $take: Int!, $skip: Int!, $order: String!) {
  userMemes(userId: $userId, take: $take, skip: $skip, order: $order) {
    items {
      ...meme
    }
    hasMore
  }
}
    ${MemeFragmentDoc}`;

export function useUserMemesQuery(options: Omit<Urql.UseQueryArgs<UserMemesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserMemesQuery>({ query: UserMemesDocument, ...options });
};
export const NewMemesDocument = gql`
    query NewMemes($take: Int!, $cursor: String) {
  newMemes(take: $take, cursor: $cursor) {
    items {
      ...userMeme
    }
    hasMore
  }
}
    ${UserMemeFragmentDoc}`;

export function useNewMemesQuery(options: Omit<Urql.UseQueryArgs<NewMemesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NewMemesQuery>({ query: NewMemesDocument, ...options });
};
export const HotMemesDocument = gql`
    query HotMemes($take: Int!, $skip: Int) {
  hotMemes(take: $take, skip: $skip) {
    items {
      ...userMeme
    }
    hasMore
  }
}
    ${UserMemeFragmentDoc}`;

export function useHotMemesQuery(options: Omit<Urql.UseQueryArgs<HotMemesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<HotMemesQuery>({ query: HotMemesDocument, ...options });
};
export const TopRatedMemesDocument = gql`
    query TopRatedMemes($take: Int!, $skip: Int!, $days: Int!) {
  topRatedMemes(take: $take, skip: $skip, days: $days) {
    items {
      ...userMeme
    }
    hasMore
  }
}
    ${UserMemeFragmentDoc}`;

export function useTopRatedMemesQuery(options: Omit<Urql.UseQueryArgs<TopRatedMemesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TopRatedMemesQuery>({ query: TopRatedMemesDocument, ...options });
};
export const UserRanksDocument = gql`
    query UserRanks($num: Int!, $userId: String, $timeFrame: String) {
  userRanks(num: $num, userId: $userId, timeFrame: $timeFrame) {
    ...rank
  }
}
    ${RankFragmentDoc}`;

export function useUserRanksQuery(options: Omit<Urql.UseQueryArgs<UserRanksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserRanksQuery>({ query: UserRanksDocument, ...options });
};
export const CurrentRanksDocument = gql`
    query CurrentRanks($userId: String) {
  currentRanks(userId: $userId) {
    ...rank
  }
}
    ${RankFragmentDoc}`;

export function useCurrentRanksQuery(options: Omit<Urql.UseQueryArgs<CurrentRanksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CurrentRanksQuery>({ query: CurrentRanksDocument, ...options });
};
export const RankingDocument = gql`
    query Ranking($timeFrame: String!, $take: Int!, $skip: Int!) {
  ranking(timeFrame: $timeFrame, take: $take, skip: $skip) {
    items {
      ...userRank
    }
    hasMore
  }
}
    ${UserRankFragmentDoc}`;

export function useRankingQuery(options: Omit<Urql.UseQueryArgs<RankingQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<RankingQuery>({ query: RankingDocument, ...options });
};
export const BestOfRedditDocument = gql`
    query BestOfReddit($take: Int!, $skip: Int!) {
  bestOfReddit(take: $take, skip: $skip) {
    items {
      ...redditMeme
    }
    hasMore
  }
}
    ${RedditMemeFragmentDoc}`;

export function useBestOfRedditQuery(options: Omit<Urql.UseQueryArgs<BestOfRedditQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<BestOfRedditQuery>({ query: BestOfRedditDocument, ...options });
};
export const RedisGetDocument = gql`
    mutation RedisGet($key: String!) {
  redisGet(key: $key)
}
    `;

export function useRedisGetMutation() {
  return Urql.useMutation<RedisGetMutation, RedisGetMutationVariables>(RedisGetDocument);
};
export const StonksDocument = gql`
    query Stonks($take: Int!, $skip: Int!, $order: String!) {
  stonks(take: $take, skip: $skip, order: $order) {
    items {
      ...stonk
    }
    hasMore
  }
}
    ${StonkFragmentDoc}`;

export function useStonksQuery(options: Omit<Urql.UseQueryArgs<StonksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<StonksQuery>({ query: StonksDocument, ...options });
};
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...userResponse
  }
}
    ${UserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const VerifyEmailDocument = gql`
    mutation VerifyEmail($token: String!) {
  verifyEmail(token: $token)
}
    `;

export function useVerifyEmailMutation() {
  return Urql.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument);
};
export const CreateHiveAcctDocument = gql`
    mutation CreateHiveAcct($new_account_name: String!, $password: String!) {
  createHiveAcct(new_account_name: $new_account_name, password: $password)
}
    `;

export function useCreateHiveAcctMutation() {
  return Urql.useMutation<CreateHiveAcctMutation, CreateHiveAcctMutationVariables>(CreateHiveAcctDocument);
};
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!, $username: String!) {
  register(email: $email, password: $password, username: $username) {
    ...userResponse
  }
}
    ${UserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const HiveLoginDocument = gql`
    mutation HiveLogin($message: String!, $signedMessage: String!, $username: String!) {
  hiveLogin(message: $message, signedMessage: $signedMessage, username: $username) {
    ...userResponse
  }
}
    ${UserResponseFragmentDoc}`;

export function useHiveLoginMutation() {
  return Urql.useMutation<HiveLoginMutation, HiveLoginMutationVariables>(HiveLoginDocument);
};
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    ...userResponse
  }
}
    ${UserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const UsersDocument = gql`
    query Users {
  users {
    ...user
  }
}
    ${UserFragmentDoc}`;

export function useUsersQuery(options: Omit<Urql.UseQueryArgs<UsersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UsersQuery>({ query: UsersDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...user
  }
}
    ${UserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const UserProfileDocument = gql`
    query UserProfile($userId: String!) {
  user(userId: $userId) {
    ...userProfile
  }
}
    ${UserProfileFragmentDoc}`;

export function useUserProfileQuery(options: Omit<Urql.UseQueryArgs<UserProfileQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserProfileQuery>({ query: UserProfileDocument, ...options });
};
export const MyProfileDocument = gql`
    query MyProfile {
  me {
    ...userProfile
  }
}
    ${UserProfileFragmentDoc}`;

export function useMyProfileQuery(options: Omit<Urql.UseQueryArgs<MyProfileQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyProfileQuery>({ query: MyProfileDocument, ...options });
};
export const IsHiveDocument = gql`
    query IsHive {
  isHive
}
    `;

export function useIsHiveQuery(options: Omit<Urql.UseQueryArgs<IsHiveQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<IsHiveQuery>({ query: IsHiveDocument, ...options });
};