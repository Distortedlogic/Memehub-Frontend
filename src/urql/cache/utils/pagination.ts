import { FieldInfo, Resolver, Variables } from "@urql/exchange-graphcache";
import { stringifyVariables } from "urql";

const isSame = (fieldArgs: Variables, info: FieldInfo) =>
  Object.keys(fieldArgs).reduce(
    (same, arg) =>
      ["skip", "cursor"].includes(arg)
        ? same
        : same && fieldArgs[arg] === info.arguments![arg],
    true as boolean
  );

export const Pagination = (__typename: string): Resolver => {
  return (_parent, fieldArgs: Variables, cache, info) => {
    const { parentKey, fieldName } = info;
    const currentKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    info.partial = !cache.resolve(parentKey, currentKey);
    const fieldInfos = cache
      .inspectFields(parentKey)
      .filter(
        (info) =>
          info.fieldName === fieldName &&
          info.arguments &&
          isSame(fieldArgs, info)
      );
    if (fieldInfos.length === 0) return undefined;
    const keys = fieldInfos.map(
      (fi) => cache.resolve(parentKey, fi.fieldKey) as string
    );
    const items = keys.reduce((data, key) => {
      data.push(...(cache.resolve(key, "items") as string[]));
      return data;
    }, [] as string[]);
    const hasMore = keys.reduce(
      (hasMore, key) => hasMore && (cache.resolve(key, "hasMore") as boolean),
      true
    );
    // if (__typename === "PaginatedMemes") {
    //   console.log("info", info);
    //   console.log("parentKey", parentKey);
    //   console.log("fieldName", fieldName);
    //   console.log("currentKey", currentKey);
    //   console.log("info.partial", info.partial);
    //   console.log("fieldInfos", fieldInfos);
    //   console.log("keys", keys);
    //   console.log("items", items);
    //   console.log("hasMore", hasMore);
    // }
    return { __typename, hasMore, items };
  };
};
