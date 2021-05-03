import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Portfolio } from "src/components/portfolio/Portfolio";
import { urqlClient } from "src/urql/urqlClient";
import { DoubleColLayout } from "../../_doubleColLayout";

interface portfolioProps {}

const portfolio: React.FC<portfolioProps> = () => {
  const router = useRouter();
  if (!router.query.userId) {
    router.push("/onboarding/hiveLogin");
  }
  const userId = router.query.userId as string;
  return (
    <DoubleColLayout>
      <Portfolio mb={4} pl={6} userId={userId} />
    </DoubleColLayout>
  );
};
export default withUrqlClient(urqlClient)(portfolio);
