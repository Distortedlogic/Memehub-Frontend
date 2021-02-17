import { Search2Icon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
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
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>
        <Image h="15px" mr={3} src={`${BUCKET_BASE_URL}/icons/person.png`} />
        Login
      </Button>
      <LoginModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const router = useRouter();
  const [, hiveLoginFN] = useHiveLoginMutation();
  const handleLogin = async (username: string, onClose: () => void) => {
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
              onClose();
              router.push(router.query.next as string);
            } else {
              onClose();
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
    <Modal isCentered preserveScrollBarGap onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent rounded="md" backgroundColor="black">
        <ModalBody px={8} py={8}>
          {canUseKeychain() ? (
            <Formik
              initialValues={{ username: "" }}
              onSubmit={async (values) => {
                handleLogin(values.username, onClose);
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Flex direction="column">
                    <InputField mb={3} placeholder="username" name="username" />
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      color="white"
                    >
                      Login
                    </Button>
                  </Flex>
                </Form>
              )}
            </Formik>
          ) : (
            <Flex direction="column">
              <Button
                mb={4}
                color="white"
                onClick={() => router.push("/newHiveAcct")}
              >
                Get Hive Blockchain Account
              </Button>
              <Button
                color="white"
                onClick={() => router.push("/installHiveKeychain")}
              >
                Install Hive Keychain
              </Button>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
