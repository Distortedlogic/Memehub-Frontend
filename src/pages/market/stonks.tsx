import { withUrqlClient } from "next-urql";
import React from "react";
import { StonkGrid } from "src/components/stonk/StonkGrid";
import { urqlClient } from "src/urql/urqlClient";
import { MarketLayout } from "./_marketLayout";

interface StonksProps {}

const Stonks: React.FC<StonksProps> = () => {
  return (
    <MarketLayout>
      <StonkGrid />
    </MarketLayout>
  );
};
export default withUrqlClient(urqlClient)(Stonks);
