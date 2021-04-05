import { Button } from "@chakra-ui/button";
import { Box, Divider, Flex, Link, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "src/components/utils/InputField";
import {
  RegisterMutationVariables,
  useRegisterMutation,
} from "src/generated/graphql";
import { SingleColLayout } from "src/pages/_singleColLayout";
import { urqlClient } from "src/urql/urqlClient";
import { toErrorMap } from "src/utils/functions";

interface RegisterProps {}

export const Register: React.FC<RegisterProps> = ({}) => {
  const [, registerFN] = useRegisterMutation();
  const toast = useToast();
  const router = useRouter();
  const handleRegister = async (
    values: RegisterMutationVariables,
    { setErrors }: any
  ) => {
    const { data } = await registerFN(values);
    if (data?.register) {
      const { user, errors } = data.register;
      if (errors) {
        setErrors(toErrorMap(errors));
      } else if (user) {
        toast({
          title: "Registered",
          status: "success",
          duration: 6000,
          description:
            "Please check your email for a Meemhub verification email. Potentially in your spam folder.",
        });
      }
    }
  };
  return (
    <SingleColLayout>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          passwordConf: "",
        }}
        onSubmit={handleRegister}
      >
        {({ isSubmitting }) => (
          <Form>
            <Flex
              minHeight="80vh"
              direction="column"
              justifyContent="center"
              alignItems="center"
              pb={6}
            >
              <Flex direction="column" w="60%">
                <Button
                  my={4}
                  onClick={() => {
                    router.push("/onboarding/newHiveAcct");
                  }}
                >
                  Get a Hive Acct
                </Button>
                <Link
                  _hover={{ cursor: "pointer" }}
                  href="https://peakd.com/about/faq"
                  target="_blank"
                >
                  <Flex justifyContent="center" alignContent="center ">
                    <Text>What is Hive?</Text>
                  </Flex>
                </Link>
                <Divider mt={4} />
                <Box mt={4}>
                  <InputField
                    name="username"
                    label="Username"
                    placeholder="username"
                  />
                </Box>
                <Box mt={4}>
                  <InputField name="email" label="Email" placeholder="email" />
                </Box>
                <Box mt={4}>
                  <InputField
                    name="password"
                    label="Password"
                    placeholder="password"
                    type="password"
                  />
                </Box>
                <Box mt={4}>
                  <InputField
                    name="passwordConf"
                    label="Confirm Password"
                    placeholder="password"
                    type="password"
                  />
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
                      router.push("onboarding/memehub/forgotPassword");
                    }}
                  >
                    <Text>Forgot Password?</Text>
                  </Box>
                </Flex>
                <Button mb={2} mt={4} type="submit" isLoading={isSubmitting}>
                  Register with Memehub
                </Button>
              </Flex>
            </Flex>
          </Form>
        )}
      </Formik>
    </SingleColLayout>
  );
};
export default withUrqlClient(urqlClient)(Register);
