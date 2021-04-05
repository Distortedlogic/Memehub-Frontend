import { Flex } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { CommentStack } from "src/components/comments/CommentStack";
import { PostCommentField } from "src/components/comments/PostCommentField";
import { MemeDisplay } from "src/components/meme/MemeDisplay";
import { useMemeQuery } from "src/generated/graphql";
import { urqlClient } from "src/urql/urqlClient";
import { ssr } from "src/utils/constants";
import { DoubleColLayout } from "../_doubleColLayout";

interface MemeProps {}

const Meme: React.FC<MemeProps> = ({}) => {
  const router = useRouter();
  const variables = {
    memeId:
      typeof router.query.memeId === "string"
        ? (router.query.memeId as string)
        : "-1",
  };
  const pause = variables.memeId === "-1";
  const [{ data, fetching }] = useMemeQuery({ pause, variables });
  if (fetching || !data?.meme) {
    return (
      <DoubleColLayout>
        <Flex h="80vh"></Flex>
      </DoubleColLayout>
    );
  }
  return (
    <DoubleColLayout>
      <Flex justifyContent="center" alignItems="center">
        <Flex direction="column" w="60%">
          <MemeDisplay meme={data.meme} />
          <PostCommentField meme={data.meme} />
          <CommentStack memeId={data.meme.id} />
        </Flex>
      </Flex>
    </DoubleColLayout>
  );
};

export default withUrqlClient(urqlClient, { ssr })(Meme);
