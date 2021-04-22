export const __prod__ = process.env.NODE_ENV === "production";
export const ssr = __prod__;
export const HIVE_COMMUNITY =
  process.env.NEXT_PUBLIC_ENV === "production" ? "hive-189111" : "hive-119015";
export const BUCKET_BASE_URL = "https://memehub.s3.amazonaws.com/memehub";

// default json_metadata when posting to hive
export const json_metadata = JSON.stringify({
  tags: ["memehub", HIVE_COMMUNITY],
  app: "memehub:beta",
  format: "markdown+html",
  community: "memehub",
});

export const isServer = () => typeof window === "undefined";
export const isBrowser = () => typeof window !== "undefined";

export const canUseKeychain = () => isBrowser() && window.hive_keychain;
export const canUseWeb3 = () => isBrowser() && window.web3;
export const ADMIN_NAME = __prod__ ? "memehub" : "memehub.bot";
