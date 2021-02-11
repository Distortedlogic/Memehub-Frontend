import { Cache, ResolveInfo, Variables } from "@urql/exchange-graphcache";
import { MeDocument, RegisterMutation } from "src/generated/graphql";
import { MeQuery } from "../../generated/graphql";
import { betterUpdateQuery } from "../utils/betterUpdateQuery";

export const register = (
  _result: any,
  _args: Variables,
  cache: Cache,
  _info: ResolveInfo
) => {
  betterUpdateQuery<RegisterMutation, MeQuery>(
    cache,
    { query: MeDocument },
    _result,
    (result, query) => {
      if (result!.register!.errors) {
        return query;
      } else {
        return {
          me: result!.register!.user,
        };
      }
    }
  );
};
