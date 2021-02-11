import { Cache, ResolveInfo, Variables } from "@urql/exchange-graphcache";
import Router from "next/router";
import { MeDocument } from "src/generated/graphql";
import { LogoutMutation, MeQuery } from "../../generated/graphql";
import { betterUpdateQuery } from "../utils/betterUpdateQuery";

export const logout = (
  _result: any,
  _fieldArgs: Variables,
  cache: Cache,
  _info: ResolveInfo
) => {
  betterUpdateQuery<LogoutMutation, MeQuery>(
    cache,
    { query: MeDocument },
    _result,
    () => {
      Router.replace("/");
      return {
        me: null,
      };
    }
  );
};
