import { useToast } from "@chakra-ui/toast";
import { VoteOperation } from "@hiveio/dhive";
import {
  CommentFragment,
  MemeFragment,
  useMeQuery,
  useUpVoteCommentMutation,
} from "src/generated/graphql";
import { getHash } from "src/utils/functions";
import { UserFragment, useUpVoteMemeMutation } from "./../generated/graphql";

export const useHandleMemeHiveVote = (
  meme: MemeFragment,
  user: UserFragment
) => {
  const toast = useToast();
  const [{ data, error, fetching }] = useMeQuery();
  const [, upVoteMemeFN] = useUpVoteMemeMutation();
  if (error) console.log("error", error);
  if (fetching || !data) return () => {};
  return async (weight: number) => {
    const url_split = meme.url.split("/");
    const permlink = url_split[url_split.length - 1].split(".")[0];
    const op: VoteOperation = [
      "vote",
      {
        voter: data.me!.username,
        author: user.username,
        permlink,
        weight,
      },
    ];
    window.hive_keychain.requestBroadcast(
      data.me!.username,
      [op],
      "Posting",
      async (resp: any) => {
        if (resp.success) {
          const { data } = await upVoteMemeFN({ memeId: meme.id });
          if (data?.upVoteMeme) {
            meme = data?.upVoteMeme;
          }
          toast({
            description: "Upvoted on Hive!",
            duration: 1000 * 3,
            isClosable: true,
            status: "success",
          });
        } else {
          toast({
            description: "Ooh no, upvoting on Hive didnt work!",
            duration: 1000 * 3,
            isClosable: true,
            status: "error",
          });
        }
      }
    );
  };
};

export const useHandleCommentHiveVote = (
  comment: CommentFragment,
  user: UserFragment
) => {
  const toast = useToast();
  const [{ data, error, fetching }] = useMeQuery();
  const [, upVoteCommentFN] = useUpVoteCommentMutation();
  if (error) console.log("error", error);
  if (fetching || !data) return () => {};
  const { me } = data;
  return async (weight: number) => {
    const permlink = await getHash(comment.text + user.username);
    const op: VoteOperation = [
      "vote",
      {
        voter: me!.username,
        author: user.username,
        permlink,
        weight,
      },
    ];
    window.hive_keychain.requestBroadcast(
      me!.username,
      [op],
      "Posting",
      async (resp: any) => {
        if (resp.success) {
          const { data } = await upVoteCommentFN({ commentId: comment.id });
          if (data?.upVoteComment) {
            comment = data?.upVoteComment;
          }
          toast({
            description: "Upvoted on Hive!",
            duration: 1000 * 3,
            isClosable: true,
            status: "success",
          });
        } else {
          toast({
            description: "Ooh no, upvoting on Hive didnt work!",
            duration: 1000 * 3,
            isClosable: true,
            status: "error",
          });
        }
      }
    );
  };
};
