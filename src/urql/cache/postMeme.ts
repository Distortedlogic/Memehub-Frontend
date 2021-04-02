import { Cache, ResolveInfo, Variables } from "@urql/exchange-graphcache";
import { resetQueries } from "./../utils/resetQueries";
const queries = ["newMemes", "myMemes", "userMemes"];
export const postMeme = (
  _result: any,
  _args: Variables,
  cache: Cache,
  _info: ResolveInfo
) => {
  resetQueries(cache, queries);
};
