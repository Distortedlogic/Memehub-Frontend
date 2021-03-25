import { Button } from "@chakra-ui/button";
import { Flex } from "@chakra-ui/layout";
import React, { useState } from "react";
import { Comments } from "./Comments";

interface CommentStackProps {
  memeId: string;
}

export const CommentStack: React.FC<CommentStackProps> = ({ memeId }) => {
  const [sortBy, setSortBy] = useState("ratio" as "ratio" | "upvotes" | "new");

  return (
    <>
      <Flex
        justifyContent="space-around"
        p={4}
        alignContent="center"
        my={2}
        rounded="md"
        backgroundColor="black"
      >
        <Button
          colorScheme={sortBy === "ratio" ? "blue" : "gray"}
          onClick={() => setSortBy("ratio")}
        >
          Top Ratio
        </Button>
        <Button
          colorScheme={sortBy === "upvotes" ? "blue" : "gray"}
          onClick={() => setSortBy("upvotes")}
        >
          Top Upvoted
        </Button>
        <Button
          colorScheme={sortBy === "new" ? "blue" : "gray"}
          onClick={() => setSortBy("new")}
        >
          New
        </Button>
      </Flex>
      <Comments memeId={memeId} order={sortBy} />
    </>
  );
};
