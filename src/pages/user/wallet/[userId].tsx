import { Flex } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Wallet } from "src/components/wallet/Wallet";
import DoubleColLayout from "src/pages/_doubleColLayout";
import { urqlClient } from "src/urql/urqlClient";
import { useUserQuery } from "../../../generated/graphql";

interface WalletProps {}

const UserWallet: React.FC<WalletProps> = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  useEffect(() => {
    if (!router.query.userId) {
      router.push("/onboarding/hiveLogin");
    }
    setUserId(router.query.userId as string | "");
  }, []);

  const [{ data, fetching, error }] = useUserQuery({ variables: { userId } });
  if (error) console.log(error);
  if (fetching || error || !data?.user)
    return (
      <DoubleColLayout>
        <Flex minH="80vh"></Flex>
      </DoubleColLayout>
    );
  return <Wallet user={data.user} />;
};
export default withUrqlClient(urqlClient)(UserWallet);
