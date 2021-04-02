import { Button } from "@chakra-ui/button";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import InputField from "src/components/utils/InputField";
import {
  LoginMutationVariables,
  useLoginMutation,
} from "src/generated/graphql";
import { urqlClient } from "src/urql/urqlClient";
import { toErrorMap } from "src/utils/functions";
import { SingleColLayout } from "../_singleColLayout";

interface MemehubProps {}

const Memehub: React.FC<MemehubProps> = () => {
  const router = useRouter();
  const startMode =
    router.query.startMode !== undefined
      ? (router.query.startMode as string)
      : "login";
  const [mode, setMode] = useState(startMode);
  switch (mode) {
    case "login":
      return (
        <SingleColLayout>
          <Login setMode={setMode} />
        </SingleColLayout>
      );
    case "register":
      return (
        <SingleColLayout>
          <Register setMode={setMode} />
        </SingleColLayout>
      );
    case "forgotPassword":
      return (
        <SingleColLayout>
          <ForgotPassword setMode={setMode} />
        </SingleColLayout>
      );
    default:
      return (
        <SingleColLayout>
          <></>
        </SingleColLayout>
      );
  }
};

interface LoginProps {
  setMode: React.Dispatch<React.SetStateAction<string>>;
}

export const Login: React.FC<LoginProps> = ({ setMode }) => {
  const [, loginFN] = useLoginMutation();
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
      }
    }
  };
  return (
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
                    setMode("register");
                  }}
                >
                  <Text>Register</Text>
                </Box>
                <Box
                  _hover={{ cursor: "pointer" }}
                  onClick={() => {
                    setMode("forgotPassword");
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
  );
};

export default withUrqlClient(urqlClient)(Memehub);
