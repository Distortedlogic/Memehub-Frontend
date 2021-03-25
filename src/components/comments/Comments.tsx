import { Stack } from "@chakra-ui/layout";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { CommentBox } from "src/components/comments/CommentBox";
import { useCommentsQuery, useEmojisQuery } from "src/generated/graphql";
import { endMessage } from "../utils/endMessage";
import { loader } from "../utils/loader";

interface CommentsProps {
  memeId: string;
  order: string;
}
const take = 8;

export const Comments: React.FC<CommentsProps> = ({ memeId, order }) => {
  const [skip, setSkip] = useState(0);
  const [
    { data: emojiData, fetching: emojiFetching, error: emojiError },
  ] = useEmojisQuery();
  const [
    { data: commentData, fetching: commentFetcing, error: commentError },
  ] = useCommentsQuery({
    variables: { memeId, take, skip, order },
  });
  const loadMore = () => setSkip(skip + take);
  if (commentError || emojiError) console.log(commentError, emojiError);
  if (
    commentFetcing ||
    !commentData?.comments ||
    emojiFetching ||
    !emojiData?.emojis
  )
    return <></>;
  const { items: comments, hasMore } = commentData.comments;
  return (
    <InfiniteScroll
      dataLength={comments.length}
      next={loadMore}
      hasMore={hasMore}
      loader={loader}
      endMessage={endMessage}
    >
      <Stack>
        {comments.map((comment) => (
          <CommentBox
            key={comment.id}
            comment={comment}
            emojis={emojiData.emojis}
          />
        ))}
      </Stack>
    </InfiniteScroll>
  );
};
