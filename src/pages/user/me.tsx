import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Profile } from "src/components/user/Profile";
import { useMyProfileQuery } from "src/generated/graphql";
import { urqlClient } from "src/urql/urqlClient";
import { DoubleColLayout } from "../_doubleColLayout";

interface meProps {}

const me: React.FC<meProps> = () => {
  const [{ data, error, fetching }] = useMyProfileQuery();
  const router = useRouter();
  if (error) {
    console.log("error", error);
  }
  if (fetching || error) {
    return (
      <DoubleColLayout>
        <></>
      </DoubleColLayout>
    );
  } else if (!data?.me) {
    router.push("/onboarding/hiveLogin");
    return (
      <DoubleColLayout>
        <></>
      </DoubleColLayout>
    );
  }
  return <Profile user={data.me} />;
};

export default withUrqlClient(urqlClient)(me);
