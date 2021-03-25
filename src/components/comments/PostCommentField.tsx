import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Image } from "@chakra-ui/image";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { Collapse } from "@chakra-ui/transition";
import { CommentOperation } from "@hiveio/dhive";
import { Form, Formik } from "formik";
import React from "react";
import {
  useEmojisQuery,
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
  const { isOpen, onToggle } = useDisclosure();
  const [, postCommentFN] = usePostCommentMutation();
  const [, setCommentIsHiveFN] = useSetCommentIsHiveMutation();
  const toast = useToast();
  const [{ fetching, error, data: meData }] = useMeQuery();
  const [
    { fetching: emojiFetching, error: emojiError, data: emojiData },
  ] = useEmojisQuery();
  if (error || emojiError) console.log(error, emojiError);
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
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <Flex direction="column">
              <Flex alignItems="center">
                <Button onClick={onToggle} h="5rem" mr={2}>
                  <Flex direction="column">
                    <Text>Meme</Text>
                    <Text>Emojis</Text>
                  </Flex>
                </Button>
                <InputField
                  textArea
                  flex={1}
                  size="lg"
                  name="text"
                  placeholder="Comment This Meme!"
                />
                <Button
                  h="5rem"
                  ml={2}
                  type="submit"
                  variantColor="blue"
                  isLoading={isSubmitting}
                >
                  Send
                </Button>
              </Flex>
              <Collapse in={isOpen}>
                <SimpleGrid
                  mt={2}
                  p={4}
                  backgroundColor="black"
                  rounded="md"
                  minChildWidth="80px"
                  spacing="15px"
                >
                  {emojiFetching || !emojiData?.emojis
                    ? null
                    : emojiData.emojis.map((emoji) => {
                        return (
                          <Button
                            py={2}
                            px={0}
                            key={emoji.name}
                            onClick={() => {
                              setFieldValue(
                                "text",
                                values.text + ` :${emoji.name}: `
                              );
                              toast({
                                title: "emoji added to comment",
                                status: "success",
                                isClosable: true,
                                duration: 3000,
                              });
                            }}
                            height="80px"
                          >
                            <Image src={emoji.url} />
                          </Button>
                        );
                      })}
                </SimpleGrid>
              </Collapse>
            </Flex>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
