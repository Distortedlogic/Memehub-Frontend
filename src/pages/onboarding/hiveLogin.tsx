import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Box, Divider, Flex, Link, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "src/components/utils/InputField";
import { useHiveLoginMutation } from "src/generated/graphql";
import { urqlClient } from "src/urql/urqlClient";
import { BUCKET_BASE_URL, canUseKeychain } from "src/utils/constants";
import { SingleColLayout } from "../_singleColLayout";

interface hiveLoginProps {}

const hiveLogin: React.FC<hiveLoginProps> = () => {
  const toast = useToast();
  const router = useRouter();
  const [, hiveLoginFN] = useHiveLoginMutation();
  const handleLogin = async (username: string) => {
    const message = new Date().toString();
    window.hive_keychain.requestSignBuffer(
      username,
      message,
      "Posting",
      async (resp: any) => {
        if (resp.success) {
          const resp2 = await hiveLoginFN({
            username: username,
            signedMessage: resp.result,
            message,
          });
          if (!!resp2.data?.hiveLogin.errors?.length) {
            toast({
              title: resp2.data?.hiveLogin.errors[0].field,
              description: resp2.data?.hiveLogin.errors[0].message,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          } else {
            if (router.query.next) {
              router.push(router.query.next as string);
            } else {
              router.push("/top/daily");
            }
          }
        } else {
          toast({
            title: "A Hive Key Chain Occurred",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    );
  };
  return (
    <SingleColLayout>
      <Flex h="80vh" justifyContent="center" alignItems="center">
        <Flex direction="column" w="60%">
          {canUseKeychain() ? (
            <Formik
              initialValues={{ username: "" }}
              onSubmit={async (values) => {
                handleLogin(values.username);
              }}
            >
              {({ submitForm }) => (
                <Form>
                  <Flex direction="column">
                    <InputField mb={3} placeholder="username" name="username" />
                    <Box
                      border="1px solid gray"
                      rounded="md"
                      backgroundColor="black"
                      p={2}
                      _hover={{ cursor: "pointer" }}
                      onClick={() => submitForm()}
                    >
                      <Flex justifyContent="center" alignItems="center">
                        <Image
                          h="30px"
                          src={`${BUCKET_BASE_URL}/logos/hive_keychain.png`}
                        />
                      </Flex>
                    </Box>
                  </Flex>
                </Form>
              )}
            </Formik>
          ) : (
            <Flex direction="column">
              <Link
                _hover={{}}
                _focus={{}}
                href="https://peakd.com/about/faq"
                target="_blank"
              >
                <Button w="100%" mb={4} color="white">
                  What is the Hive Blockchain?
                </Button>
              </Link>
              <Button
                mb={4}
                color="white"
                onClick={() => router.push("/onboarding/newHiveAcct")}
              >
                Get Hive Blockchain Account
              </Button>
              <Button
                color="white"
                onClick={() => router.push("/onboarding/installHiveKeychain")}
              >
                Install Hive Keychain
              </Button>
              <Divider mt={4} mb={2} />
              <Flex
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <Text my={1} fontSize="15px" color="white" fontWeight="bold">
                  Login With Memehub
                </Text>
              </Flex>
              <Box
                border="1px solid gray"
                my={2}
                rounded="md"
                backgroundColor="black"
                p={2}
                _hover={{ cursor: "pointer" }}
                onClick={() => router.push("/onboarding/memehub/login")}
              >
                <Flex justifyContent="center" alignItems="center">
                  <Image
                    h="35px"
                    src={`${BUCKET_BASE_URL}/logos/main-logo.png`}
                  />
                </Flex>
              </Box>
              <Flex px={4} mb={4} justifyContent="space-between">
                <Box
                  _hover={{ cursor: "pointer" }}
                  onClick={() => router.push("/onboarding/memehub/register")}
                >
                  <Text color="white">register</Text>
                </Box>
                <Box
                  _hover={{ cursor: "pointer" }}
                  onClick={() =>
                    router.push("/onboarding/memehub/forgotPassword")
                  }
                >
                  <Text color="white">forgot password</Text>
                </Box>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
    </SingleColLayout>
  );
};
export default withUrqlClient(urqlClient)(hiveLogin);
