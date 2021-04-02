import { Button } from "@chakra-ui/button";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "src/components/utils/InputField";
import {
  LoginMutationVariables,
  useLoginMutation,
} from "src/generated/graphql";
import { SingleColLayout } from "src/pages/_singleColLayout";
import { urqlClient } from "src/urql/urqlClient";
import { toErrorMap } from "src/utils/functions";

interface LoginProps {}

export const Login: React.FC<LoginProps> = () => {
  const [, loginFN] = useLoginMutation();
  const router = useRouter();
  const handleLogin = async (
    values: LoginMutationVariables,
    { setErrors }: any
  ) => {
    const { data } = await loginFN(values);
    if (data?.login) {
      const { user, errors } = data.login;
      if (errors) {
        setErrors(toErrorMap(errors));
      } else if (user) {
        router.push("/top-ratio/daily");
      }
    }
  };
  return (
    <SingleColLayout>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form>
            <Flex
              h="80vh"
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Flex direction="column" w="60%" p={6}>
                <Box mt={4}>
                  <InputField
                    name="username"
                    label="Username"
                    placeholder="username"
                  />
                </Box>
                <Box mt={4}>
                  <InputField
                    name="password"
                    label="Password"
                    placeholder="password"
                    type="password"
                  />
                </Box>
                <Flex justifyContent="space-between" mt={2} mx={1}>
                  <Box
                    _hover={{ cursor: "pointer" }}
                    onClick={() => {
                      router.push("/onboarding/memehub/register");
                    }}
                  >
                    <Text>Register</Text>
                  </Box>
                  <Box
                    _hover={{ cursor: "pointer" }}
                    onClick={() => {
                      router.push("/onboarding/memehub/forgotPassword");
                    }}
                  >
                    <Text>Forgot Password?</Text>
                  </Box>
                </Flex>
                <Button mb={2} mt={4} type="submit" isLoading={isSubmitting}>
                  Login
                </Button>
              </Flex>
            </Flex>
          </Form>
        )}
      </Formik>
    </SingleColLayout>
  );
};
export default withUrqlClient(urqlClient)(Login);
