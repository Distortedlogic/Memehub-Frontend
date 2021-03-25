import { withUrqlClient } from "next-urql";
import React from "react";
import { TopRated } from "src/components/meme/TopRated";
import { urqlClient } from "src/urql/urqlClient";
import { ssr } from "src/utils/constants";

const WeeklyTopRatioMemes = () => <TopRated days={7} />;

export default withUrqlClient(urqlClient, { ssr })(WeeklyTopRatioMemes);
