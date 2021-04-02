import { Cache, ResolveInfo, Variables } from "@urql/exchange-graphcache";
const queries = ["myComments"];
export const postComment = (
  _result: any,
  _args: Variables,
  cache: Cache,
  _info: ResolveInfo
) => {
  cache.inspectFields("Query").forEach((info: any) => {
    if (
      info.fieldName === "comments" &&
      info.arguments.memeId === _args.memeId
    ) {
      cache.invalidate("Query", _info.fieldName, info.arguments || {});
    }
    queries.forEach((name) => {
      if (info.fieldName === name) {
        cache.invalidate("Query", name, info.arguments || {});
      }
    });
  });
};
