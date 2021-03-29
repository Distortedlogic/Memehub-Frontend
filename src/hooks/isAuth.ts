import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "src/generated/graphql";

export const useIsAuth = () => {
  const [{ data, error, fetching }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!error && !fetching && !data?.me) {
      router.replace("/onboarding/memehub?startMode=login");
    }
  }, [fetching, data, router]);
  return [{ data, error, fetching }];
};
