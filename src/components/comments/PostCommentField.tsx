import { Button } from "@chakra-ui/button";
import { Box, Flex } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { CommentOperation } from "@hiveio/dhive";
import { Form, Formik } from "formik";
import React from "react";
import {
  useMeQuery,
  usePostCommentMutation,
  UserMemeFragment,
  useSetCommentIsHiveMutation,
} from "src/generated/graphql";
import { json_metadata } from "src/utils/constants";
import { getHash } from "src/utils/functions";
import InputField from "../utils/InputField";

interface PostCommentFieldProps {
  meme: UserMemeFragment;
}

export const PostCommentField: React.FC<PostCommentFieldProps> = ({ meme }) => {
  const [, postCommentFN] = usePostCommentMutation();
  const [, setCommentIsHiveFN] = useSetCommentIsHiveMutation();
  const toast = useToast();
  const [{ fetching, error, data: meData }] = useMeQuery();
  if (error) console.log(error);
  if (fetching) {
    return <></>;
  }
  const handleSubmit = async (values: { text: string }) => {
    if (!values.text)
      toast({
        title: "Please Enter A Comment",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    else {
      if (meme.isHive && meData?.me?.isHive) {
        const { me } = meData;
        const permlink = await getHash(values.text + me.username);
        const url_split = meme.url.split("/");
        const parent_permlink = url_split[url_split.length - 1].split(".")[0];
        const op: CommentOperation = [
          "comment",
          {
            author: me.username,
            body: values.text,
            json_metadata,
            parent_author: meme.user.username,
            parent_permlink,
            permlink,
            title: "",
          },
        ];
        window.hive_keychain.requestBroadcast(
          me.username,
          [op],
          "Posting",
          async (resp: any) => {
            if (resp.success) {
              const { data } = await postCommentFN({
                ...values,
                memeId: meme.id,
              });
              if (data?.postComment) {
                const { postComment: comment } = data;
                await setCommentIsHiveFN({
                  commentId: comment.id,
                  permlink,
                });
                values.text = "";
                toast({
                  description: "Posted to hive!",
                  duration: 1000 * 3,
                  isClosable: true,
                  status: "success",
                });
              } else {
                toast({
                  title: "Something Went Wrong",
                  description: "Please Try Again",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
              }
            } else {
              toast({
                description: "Ooh no, posting to hive didnt work!",
                duration: 1000 * 3,
                isClosable: true,
                status: "error",
              });
            }
          }
        );
      } else {
        const { data } = await postCommentFN({ ...values, memeId: meme.id });
        if (data?.postComment) {
          values.text = "";
          toast({
            title: "Posted to Memehub!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Something Went Wrong",
            description: "Please Try Again",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    }
  };
  return (
    <Box mt={2}>
      <Formik initialValues={{ text: "" }} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <Flex direction="column">
              <Flex alignItems="center" justifyContent="center">
                <InputField
                  textArea
                  flex={1}
                  size="lg"
                  name="text"
                  placeholder="Comment This Meme!"
                />
                <Button h="5rem" ml={2} type="submit" isLoading={isSubmitting}>
                  Send
                </Button>
              </Flex>
            </Flex>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
