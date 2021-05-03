import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { DayTradeHistory } from "src/components/portfolio/DayTradeHistory";
import DoubleColLayout from "src/pages/_doubleColLayout";
import { urqlClient } from "src/urql/urqlClient";

interface UserProfileProps {}

const UserProfile: React.FC<UserProfileProps> = () => {
  const router = useRouter();
  return (
    <DoubleColLayout>
      <DayTradeHistory pt={4} m={2} userId={router.query.userId as string} />
    </DoubleColLayout>
  );
};
export default withUrqlClient(urqlClient)(UserProfile);
