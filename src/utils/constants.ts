export const __prod__ = process.env.NODE_ENV === "production";
export const ssr = __prod__;
export const HIVE_COMMUNITY =
  process.env.NEXT_PUBLIC_ENV === "production" ? "hive-189111" : "hive-119015";
export const BUCKET_BASE_URL = "https://memehub.s3.amazonaws.com/memehub";

export const isServer = () => typeof window === "undefined";
export const isBrowser = () => typeof window !== "undefined";

export const canUseKeychain = () => isBrowser() && window.hive_keychain;
