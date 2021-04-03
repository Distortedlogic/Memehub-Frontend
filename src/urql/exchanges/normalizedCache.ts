import { cacheExchange } from "@urql/exchange-graphcache";
import { register } from "../cache/register";
import { Pagination } from "../cache/utils/pagination";
import { hiveLogin } from "./../cache/login";
import { logout } from "./../cache/logout";
import { postComment } from "./../cache/postComment";
import { postMeme } from "./../cache/postMeme";

export const normalizedCache = cacheExchange({
  keys: {
    PaginatedMemes: () => null,
    PaginatedComments: () => null,
    PaginatedRanks: () => null,
    PaginatedStonks: () => null,
    PaginatedPositions: () => null,
    LeaderBoard: () => null,
    Leader: () => null,
    Rank: () => null,
    Emoji: () => null,
    Stonk: () => null,
  },
  resolvers: {
    Query: {
      newMemes: Pagination("PaginatedMemes"),
      hotMemes: Pagination("PaginatedMemes"),
      topRatedMemes: Pagination("PaginatedMemes"),
      comments: Pagination("PaginatedComments"),
      myComments: Pagination("PaginatedComments"),
      userMemes: Pagination("PaginatedMemes"),
      ranking: Pagination("PaginatedRanks"),
      stonks: Pagination("PaginatedStonks"),
    },
  },
  updates: {
    Mutation: {
      logout,
      hiveLogin,
      register,
      postMeme,
      postComment,
    },
  },
});
