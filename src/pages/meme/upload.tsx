import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { CheckIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "src/components/utils/InputField";
import { useMeUploadQuery } from "src/generated/graphql";
import { useIsAuth } from "src/hooks/isAuth";
import { useClipboard } from "src/hooks/useClipboard";
import { useUpload } from "src/hooks/useUpload";
import { urqlClient } from "src/urql/urqlClient";
import { BUCKET_BASE_URL } from "src/utils/constants";
import { SingleColLayout } from "../_singleColLayout";
dayjs.extend(relativeTime);
interface UploadProps {}

const Upload: React.FC<UploadProps> = () => {
  useIsAuth();
  const [{ data, error, fetching }] = useMeUploadQuery();
  const toast = useToast();
  const router = useRouter();
  const uploadFN = useUpload();
  const getFromClipboard = useClipboard();
  if (error) console.log("error", error);
  if (fetching || !data?.me) return <></>;
  const { me } = data;
  const canHivePost =
    !me.lastHivePost ||
    (me.lastHivePost && dayjs(me.lastHivePost) < dayjs().subtract(1, "d"));
  const canMemehubPost =
    !me.lastMemehubPost ||
    (me.lastMemehubPost &&
      dayjs(me.lastMemehubPost) < dayjs().subtract(1, "d"));
  const hivePostCheck = (
    <Button my={1} size="sm">
      <Image h="20px" src={BUCKET_BASE_URL + "/logos/hive.png"} mr={2} />
      {canHivePost ? <CheckIcon /> : dayjs(me.lastHivePost).fromNow()}
    </Button>
  );
  const memehubPostCheck = (
    <Button my={1} size="sm">
      <Image h="20px" src={BUCKET_BASE_URL + "/logos/icon.png"} mr={2} />
      {canMemehubPost ? <CheckIcon /> : dayjs(me.lastMemehubPost).fromNow()}
    </Button>
  );
  return (
    <SingleColLayout>
      <Formik
        initialValues={{
          file: undefined,
          title: "",
          url: undefined,
          isHive: false,
        }}
        onSubmit={async (values) => {
          if (values.file && values.title) {
            const memeId = await uploadFN(
              values.file,
              values.isHive,
              values.title
            );
            if (memeId) {
              router.push(`/meme/${memeId}`);
            } else {
              toast({
                title: "Oh no something went wrong",
                status: "error",
              });
            }
          } else {
            toast({ title: "missing file or title", status: "error" });
          }
        }}
      >
        {({ values: { isHive, url }, setFieldValue, isSubmitting }) => (
          <Form>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              w="100%"
            >
              <Flex p={6} direction="column" w="60%">
                <InputField mb={4} name="title" placeholder="Title" />
                <Flex
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  mb={4}
                >
                  <Box _hover={{ cursor: "pointer" }}>
                    <Image
                      p={2}
                      maxHeight="330px"
                      src={
                        url ? url : `${BUCKET_BASE_URL}/misc/pepecollage.png`
                      }
                    />
                  </Box>
                </Flex>
                <Flex>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    multiple={true}
                    style={{
                      backgroundColor: "white",
                      width: "100%",
                    }}
                    onChange={(e) => {
                      setFieldValue(
                        "file",
                        e.currentTarget.files
                          ? e.currentTarget.files[0]
                          : undefined
                      );
                      setFieldValue(
                        "url",
                        e.currentTarget.files
                          ? URL.createObjectURL(e.currentTarget.files[0])
                          : undefined
                      );
                    }}
                  />
                  <Button
                    h="auto"
                    ml={2}
                    onClick={async () => await getFromClipboard(setFieldValue)}
                  >
                    <FontAwesomeIcon icon={["fas", "clipboard"]} />
                  </Button>
                  <Button
                    h="auto"
                    ml={2}
                    onClick={async () => {
                      setFieldValue("file", undefined);
                    }}
                  >
                    <FontAwesomeIcon icon={["fas", "trash"]} />
                  </Button>
                </Flex>
                <Flex my={2}>
                  <Checkbox onChange={() => setFieldValue("isHive", !isHive)}>
                    <Text>Post to Hive</Text>
                  </Checkbox>
                  <Flex justifyContent="center" alignItems="center" flex={1}>
                    <Flex w="60%">
                      <Text>
                        There is a one meme post per day limit to each Hive and
                        Memehub respectively
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex direction="column">
                    {hivePostCheck}
                    {memehubPostCheck}
                  </Flex>
                </Flex>
                {me.isHive ? null : (
                  <Button
                    mb={4}
                    onClick={() => {
                      router.push("/onboarding/newHiveAcct");
                    }}
                  >
                    Turn Dankness into Crypto! Get a Hive Acct Here!
                  </Button>
                )}
                {isHive ? (
                  <Button
                    isDisabled={!canHivePost}
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Posting to Hive and Memehub
                  </Button>
                ) : (
                  <Button
                    isDisabled={!canMemehubPost}
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Posting Memehub Only
                  </Button>
                )}
              </Flex>
            </Flex>
          </Form>
        )}
      </Formik>
    </SingleColLayout>
  );
};
export default withUrqlClient(urqlClient)(Upload);
