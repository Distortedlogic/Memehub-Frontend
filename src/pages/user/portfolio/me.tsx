import { withUrqlClient } from "next-urql";
import React from "react";
import { Portfolio } from "src/components/portfolio/Portfolio";
import { useIsAuth } from "src/hooks/isAuth";
import { urqlClient } from "src/urql/urqlClient";
import { DoubleColLayout } from "../../_doubleColLayout";

interface portfolioProps {}

const portfolio: React.FC<portfolioProps> = () => {
  const [{ data, fetching, error }] = useIsAuth();
  if (error) console.log(error);
  if (fetching || error || !data?.me)
    return (
      <DoubleColLayout>
        <></>
      </DoubleColLayout>
    );
  const { me } = data;
  return (
    <DoubleColLayout>
      <Portfolio mb={4} pl={6} userId={me.id} />
    </DoubleColLayout>
  );
};
export default withUrqlClient(urqlClient)(portfolio);
