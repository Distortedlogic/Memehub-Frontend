import { withUrqlClient } from "next-urql";
import React from "react";
import { StonkGrid } from "src/components/stonk/StonkGrid";
import { urqlClient } from "src/urql/urqlClient";
import { DoubleColLayout } from "../_doubleColLayout";

interface StonksProps {}

const Stonks: React.FC<StonksProps> = () => {
  return (
    <DoubleColLayout>
      <StonkGrid />
    </DoubleColLayout>
  );
};
export default withUrqlClient(urqlClient)(Stonks);
