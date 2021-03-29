import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import InputField from "src/components/utils/InputField";
import { useIsAuth } from "src/hooks/isAuth";
import { useClipboard } from "src/hooks/useClipboard";
import { useUpload } from "src/hooks/useUpload";
import { urqlClient } from "src/urql/urqlClient";
import { BUCKET_BASE_URL } from "src/utils/constants";
import { SingleColLayout } from "./_singleColLayout";

interface UploadProps {}

const Upload: React.FC<UploadProps> = () => {
  const [{ data, error, fetching }] = useIsAuth();
  const toast = useToast();
  const router = useRouter();
  const uploadFN = useUpload();
  const getFromClipboard = useClipboard();
  const [postToHive, setPostToHive] = useState(false);
  if (error) console.log("error", error);
  if (fetching || !data?.me) return <></>;
  const { me } = data;
  return (
    <SingleColLayout>
      <Formik
        initialValues={{
          file: undefined,
          title: "",
          isHive: false,
        }}
        onSubmit={async (values) => {
          const memeId = await uploadFN(values.file, postToHive, values.title);
          if (memeId) {
            router.push(`meme/${memeId}`);
          } else {
            toast({
              title: "Oh no something went wrong",
              status: "error",
            });
          }
        }}
      >
        {({ values: { file, isHive }, setFieldValue, isSubmitting }) => (
          <Form>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              w="100%"
            >
              <Flex p={6} direction="column" w="60%">
                <InputField mb={4} name="title" placeholder="Title" />
                {file ? (
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
                        src={URL.createObjectURL(file)}
                      />
                    </Box>
                  </Flex>
                ) : (
                  <Image
                    mb={4}
                    src={`${BUCKET_BASE_URL}/misc/pepecollage.png`}
                  />
                )}
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
                <Checkbox mt={2} onClick={() => setPostToHive(!postToHive)}>
                  <Text>Post to Hive</Text>
                </Checkbox>
                {me.isHive ? null : (
                  <Button
                    mt={4}
                    onClick={() => {
                      router.push("/onboarding/newHiveAcct");
                    }}
                  >
                    Turn Dankness into Crypto! Get a Hive Acct Here!
                  </Button>
                )}
                <Button mt={4} type="submit" isLoading={isSubmitting}>
                  {isHive ? "Posting to Hive" : "Posting To Memehub Only"}
                </Button>
              </Flex>
            </Flex>
          </Form>
        )}
      </Formik>
    </SingleColLayout>
  );
};
export default withUrqlClient(urqlClient)(Upload);
