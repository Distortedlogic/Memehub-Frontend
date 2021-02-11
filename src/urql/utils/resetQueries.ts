import { Cache } from "@urql/exchange-graphcache";

export const resetQueries = (cache: Cache, names: string[]) => {
  cache.inspectFields("Query").forEach((info: any) => {
    names.forEach((name) => {
      if (info.fieldName === name) {
        cache.invalidate("Query", name, info.arguments || {});
      }
    });
  });
};
