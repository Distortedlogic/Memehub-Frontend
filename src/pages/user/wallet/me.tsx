import { withUrqlClient } from "next-urql";
import React from "react";
import { Wallet } from "src/components/wallet/Wallet";
import { useMeQuery } from "src/generated/graphql";
import DoubleColLayout from "src/pages/_doubleColLayout";
import { urqlClient } from "src/urql/urqlClient";

interface WalletProps {}

const MyWallet: React.FC<WalletProps> = () => {
  const [{ data, error, fetching }] = useMeQuery();
  if (error) console.log("error", error);
  if (error || fetching || !data?.me) {
    return (
      <DoubleColLayout>
        <></>
      </DoubleColLayout>
    );
  } else {
    return <Wallet user={data.me} />;
  }
};
export default withUrqlClient(urqlClient)(MyWallet);
