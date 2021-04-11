import { Cache, ResolveInfo, Variables } from "@urql/exchange-graphcache";
import { resetQueries } from "../../utils/resetQueries";
const queries = ["myComments", "userComments"];
export const resetComments = (
  _result: any,
  _args: Variables,
  cache: Cache,
  _info: ResolveInfo
) => {
  resetQueries(cache, queries);
};
