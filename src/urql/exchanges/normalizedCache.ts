import { cacheExchange } from "@urql/exchange-graphcache";
import { register } from "../cache/register";
import { hiveLogin } from "./../cache/login";
import { logout } from "./../cache/logout";

export const normalizedCache = cacheExchange({
  keys: { PaginatedRanks: () => null, Rank: () => null },
  resolvers: {
    Query: {},
  },
  updates: {
    Mutation: {
      logout,
      hiveLogin,
      register,
    },
  },
});
