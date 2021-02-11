import { requestPolicyExchange } from "@urql/exchange-request-policy";

export const rpExchange = requestPolicyExchange({
  ttl: 1000 * 60 * 5,
  shouldUpgrade: (operation) =>
    operation.context.requestPolicy !== "cache-only",
});
