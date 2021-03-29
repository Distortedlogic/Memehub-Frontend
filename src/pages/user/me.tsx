import { withUrqlClient } from "next-urql";
import React from "react";
import { Profile } from "src/components/Profile";
import { useMyProfileQuery } from "src/generated/graphql";
import { urqlClient } from "src/urql/urqlClient";
import { DoubleColLayout } from "../_doubleColLayout";

interface meProps {}

const me: React.FC<meProps> = () => {
  const [{ data, error, fetching }] = useMyProfileQuery();
  if (error) {
    console.log("error", error);
  }
  if (fetching || !data?.me) {
    return (
      <DoubleColLayout>
        <></>
      </DoubleColLayout>
    );
  }
  return <Profile user={data.me} />;
};

export default withUrqlClient(urqlClient)(me);
