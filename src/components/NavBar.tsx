import { Search2Icon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useHiveLoginMutation, useMeQuery } from "src/generated/graphql";
import { BUCKET_BASE_URL, canUseKeychain } from "src/utils/constants";
import InputField from "./utils/InputField";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      w="100%"
      h="100%"
      px={4}
    >
      <Flex>
        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<Search2Icon />} />
          <Input
            border="none"
            rounded="none"
            borderBottom="1px solid gray"
            placeholder="search..."
          />
        </InputGroup>
      </Flex>
      <Flex justifyContent="center" alignContent="center">
        <NextLink href="/">
          <Link>
            <Image
              src={`${BUCKET_BASE_URL}/icons/memehub.png`}
              my={2}
              h="35px"
            />
          </Link>
        </NextLink>
      </Flex>
      <Login />
    </Flex>
  );
};

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [{ data, error, fetching }] = useMeQuery({});
  const router = useRouter();
  if (error) console.log(error);
  if (fetching || !data?.me) return <LoginButton />;
  else
    return (
      <Avatar
        _hover={{ cursor: "pointer" }}
        onClick={() => router.push("/user/me")}
        size="sm"
        src={data.me.avatar}
      />
    );
};

interface LoginButtonProps {}
const LoginButton: React.FC<LoginButtonProps> = () => {
  const [openModal, setOpenModal] = useState<string | undefined>(undefined);
  return (
    <>
      <Button onClick={() => setOpenModal("login")}>
        <Image h="15px" mr={3} src={`${BUCKET_BASE_URL}/icons/person.png`} />
        Login
      </Button>
      <LoginModal openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
};

interface LoginModalProps {
  openModal: string | undefined;
  setOpenModal: Dispatch<SetStateAction<string | undefined>>;
}

const LoginModal: React.FC<LoginModalProps> = ({ openModal, setOpenModal }) => {
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
              setOpenModal(undefined);
              router.push(router.query.next as string);
            } else {
              setOpenModal(undefined);
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
    <Modal
      isCentered
      preserveScrollBarGap
      onClose={() => setOpenModal(undefined)}
      isOpen={openModal === "login"}
    >
      <ModalOverlay />
      <ModalContent rounded="md" backgroundColor="black">
        <ModalBody px={8} py={8}>
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
            </Flex>
          )}
          <Divider mt={4} mb={2} />
          <Flex direction="column" justifyContent="center" alignItems="center">
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
          >
            <Flex justifyContent="center" alignItems="center">
              <Image h="35px" src={`${BUCKET_BASE_URL}/logos/main-logo.png`} />
            </Flex>
          </Box>
          <Flex px={4} mb={4} justifyContent="space-between">
            <Box _hover={{ cursor: "pointer" }}>
              <Text color="white">register</Text>
            </Box>
            <Box _hover={{ cursor: "pointer" }}>
              <Text color="white">forgot password</Text>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
