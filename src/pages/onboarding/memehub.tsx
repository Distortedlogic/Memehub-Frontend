import { Button } from "@chakra-ui/button";
import { Box, Divider, Flex, Link, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import InputField from "src/components/utils/InputField";
import {
  ForgotPasswordMutationVariables,
  LoginMutationVariables,
  RegisterMutationVariables,
  useForgotPasswordMutation,
  useLoginMutation,
  useRegisterMutation,
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
          <Flex direction="column" alignItems="center" justifyContent="center">
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

interface RegisterProps {
  setMode: React.Dispatch<React.SetStateAction<string>>;
}

export const Register: React.FC<RegisterProps> = ({ setMode }) => {
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
          <Flex direction="column" justifyContent="center" alignItems="center">
            <Flex direction="column" w="60%">
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
                    setMode("login");
                  }}
                >
                  <Text>Login</Text>
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
                Register with Memehub
              </Button>
              <Divider />
              <Button
                mb={2}
                mt={2}
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
            </Flex>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

interface ForgotPasswordProps {
  setMode: React.Dispatch<React.SetStateAction<string>>;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ setMode }) => {
  const [, forgotPasswordFN] = useForgotPasswordMutation();
  const toast = useToast();

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
    <Formik
      initialValues={{
        email: "",
      }}
      onSubmit={handleForgotPassword}
    >
      {({ isSubmitting }) => (
        <Form>
          <Flex direction="column" justifyContent="center" alignItems="center">
            <Flex direction="column" w="60%">
              <Box mt={4}>
                <InputField name="email" label="email" placeholder="email" />
              </Box>
              <Flex justifyContent="space-between" mt={2}>
                <Box
                  _hover={{ cursor: "pointer" }}
                  onClick={() => {
                    setMode("login");
                  }}
                >
                  <Text>Login</Text>
                </Box>
                <Box
                  _hover={{ cursor: "pointer" }}
                  onClick={() => {
                    setMode("register");
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
  );
};

export default withUrqlClient(urqlClient)(Memehub);
