import { withUrqlClient } from "next-urql";
import React from "react";
import { TopRated } from "src/components/meme/TopRated";
import { urqlClient } from "src/urql/urqlClient";
import { ssr } from "src/utils/constants";

const EverTopRatioMemes = () => <TopRated days={-1} />;

export default withUrqlClient(urqlClient, { ssr })(EverTopRatioMemes);
