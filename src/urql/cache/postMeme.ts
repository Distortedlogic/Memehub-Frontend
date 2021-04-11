import { Cache, ResolveInfo, Variables } from "@urql/exchange-graphcache";
import { resetQueries } from "./../utils/resetQueries";
import { resetMemes } from "./utils/resetMemes";

export const postMeme = (
  _result: any,
  _args: Variables,
  cache: Cache,
  _info: ResolveInfo
) => {
  resetMemes(_result, _args, cache, _info);
  resetQueries(cache, ["meUpload"]);
};
