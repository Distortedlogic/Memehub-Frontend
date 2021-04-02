import { Button } from "@chakra-ui/button";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "src/components/utils/InputField";
import {
  ForgotPasswordMutationVariables,
  useForgotPasswordMutation,
} from "src/generated/graphql";
import { SingleColLayout } from "src/pages/_singleColLayout";
import { urqlClient } from "src/urql/urqlClient";

interface ForgotPasswordProps {}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  const [, forgotPasswordFN] = useForgotPasswordMutation();
  const toast = useToast();
  const router = useRouter();
  const handleForgotPassword = async (
    values: ForgotPasswordMutationVariables
  ) => {
    const { data } = await forgotPasswordFN(values);
    if (data) {
      toast({
        title: "Please Check Your Email",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <SingleColLayout>
      <Formik
        initialValues={{
          email: "",
        }}
        onSubmit={handleForgotPassword}
      >
        {({ isSubmitting }) => (
          <Form>
            <Flex
              h="80vh"
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Flex direction="column" w="60%">
                <Box mt={4}>
                  <InputField name="email" label="email" placeholder="email" />
                </Box>
                <Flex justifyContent="space-between" mt={2}>
                  <Box
                    _hover={{ cursor: "pointer" }}
                    onClick={() => {
                      router.push("onboarding/memehub/login");
                    }}
                  >
                    <Text>Login</Text>
                  </Box>
                  <Box
                    _hover={{ cursor: "pointer" }}
                    onClick={() => {
                      router.push("onboarding/memehub/register");
                    }}
                  >
                    <Text>Register</Text>
                  </Box>
                </Flex>
                <Button mb={2} mt={4} type="submit" isLoading={isSubmitting}>
                  Send Reset Email
                </Button>
              </Flex>
            </Flex>
          </Form>
        )}
      </Formik>
    </SingleColLayout>
  );
};
export default withUrqlClient(urqlClient)(ForgotPassword);
