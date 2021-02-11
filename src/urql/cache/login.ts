import { Cache, ResolveInfo, Variables } from "@urql/exchange-graphcache";
import { MeDocument } from "src/generated/graphql";
import { MeQuery } from "../../generated/graphql";
import { betterUpdateQuery } from "../utils/betterUpdateQuery";
import { HiveLoginMutation } from "./../../generated/graphql";

export const hiveLogin = (
  _result: any,
  _args: Variables,
  cache: Cache,
  _info: ResolveInfo
) => {
  betterUpdateQuery<HiveLoginMutation, MeQuery>(
    cache,
    { query: MeDocument },
    _result,
    (result, query) => {
      if (result!.hiveLogin!.errors) {
        return query;
      } else {
        return {
          me: result!.hiveLogin!.user,
        };
      }
    }
  );
};
