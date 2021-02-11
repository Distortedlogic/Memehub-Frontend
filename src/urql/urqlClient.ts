import { devtoolsExchange } from "@urql/devtools";
import { isServer } from "src/utils/constants";
import { SubscriptionClient } from "subscriptions-transport-ws";
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  subscriptionExchange,
} from "urql";
import { errorExchange } from "./exchanges/errorExchange";
import { normalizedCache } from "./exchanges/normalizedCache";
import { rpExchange } from "./exchanges/requestPolicyExchange";

const subscriptionClient = !isServer()
  ? new SubscriptionClient(process.env.NEXT_PUBLIC_SUBSCRIPTION_URL!, {
      reconnect: true,
    })
  : null;

export const urqlClient = (ssrExchange: Exchange, ctx: any) => {
  let cookie;
  if (isServer() && ctx?.req?.headers) {
    cookie = ctx.req.headers.cookie;
  }
  return {
    url: process.env.NEXT_PUBLIC_API_URL! as string,
    fetchOptions: { credentials: "include" as const, headers: { cookie } },
    exchanges: [
      devtoolsExchange,
      dedupExchange,
      rpExchange,
      normalizedCache,
      errorExchange,
      ssrExchange,
      // persistedFetchExchange({}),
      subscriptionExchange({
        forwardSubscription(operation) {
          return subscriptionClient!.request(operation);
        },
      }),
      fetchExchange,
    ],
  };
};
