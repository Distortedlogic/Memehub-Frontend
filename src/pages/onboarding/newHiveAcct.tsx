import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { PrivateKey } from "@hiveio/dhive";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import InputField from "src/components/utils/InputField";
import { useCreateHiveAcctMutation } from "src/generated/graphql";
import { hive } from "src/hiveConnection";
import { urqlClient } from "src/urql/urqlClient";
import { canUseKeychain } from "src/utils/constants";
import { SingleColLayout } from "../_singleColLayout";
const checkAcctName = async (username: string) => {
  const ac = await hive.database.call("lookup_account_names", [[username]]);
  return ac[0] == null;
};

const roles = ["owner", "active", "posting", "memo"] as const;

interface keys {
  owner: string;
  active: string;
  posting: string;
  memo: string;
  ownerPubkey: string;
  activePubkey: string;
  postingPubkey: string;
  memoPubkey: string;
}

const getKeys = (username: string, password: string): keys => {
  const privKeys = {
    owner: PrivateKey.fromLogin(username, password, "owner").toString(),
    active: PrivateKey.fromLogin(username, password, "active").toString(),
    posting: PrivateKey.fromLogin(username, password, "posting").toString(),
    memo: PrivateKey.fromLogin(username, password, "memo").toString(),
    ownerPubkey: "",
    activePubkey: "",
    postingPubkey: "",
    memoPubkey: "",
  };
  privKeys.ownerPubkey = PrivateKey.from(privKeys.owner)
    .createPublic()
    .toString();
  privKeys.activePubkey = PrivateKey.from(privKeys.active)
    .createPublic()
    .toString();
  privKeys.postingPubkey = PrivateKey.from(privKeys.posting)
    .createPublic()
    .toString();
  privKeys.memoPubkey = PrivateKey.from(privKeys.memo)
    .createPublic()
    .toString();
  return privKeys;
};

const genPassword = () => {
  const array = new Uint32Array(10);
  window.crypto.getRandomValues(array);
  return "P" + PrivateKey.fromSeed(array.toString()).toString();
};

interface NewHiveAcctProps {}

const NewHiveAcct: React.FC<NewHiveAcctProps> = () => {
  const [, createHiveAcctFN] = useCreateHiveAcctMutation();
  const [safetyCheck, setSafetyCheck] = useState(false);
  const [password, setPassword] = useState<string>();
  const [keys, setKeys] = useState<keys>();
  const router = useRouter();
  const toast = useToast();
  const [username, setUsername] = useState("");
  useEffect(() => {
    if (username) {
      setPassword(genPassword());
      setKeys(getKeys(username, password!));
    }
  }, [username]);
  const DisplayKeys = () =>
    keys ? (
      roles.map((role) => (
        <Box key={role}>
          <Text
            textTransform="capitalize"
            textAlign="center"
            fontSize="25px"
            fontWeight="bold"
            mb={2}
          >
            {role}
          </Text>
          <Text textAlign="center" color="white" mb={2}>
            {keys[role]}
          </Text>
        </Box>
      ))
    ) : (
      <></>
    );
  const onContinue = async () => {
    if (safetyCheck) {
      const resp = await createHiveAcctFN({
        new_account_name: username,
        password: password!,
      });
      if (resp.data?.createHiveAcct) {
        if (canUseKeychain()) {
          toast({
            title: "Hive Acct Create",
            description: "Now Login and start earning crypto!",
            status: "success",
            isClosable: true,
            duration: 3000,
          });
          router.push("/");
        } else {
          toast({
            title: "Hive Acct Create",
            description: "Now lets install Hive Keychain",
            status: "success",
            isClosable: true,
            duration: 3000,
          });
          router.push("/onboarding/installHiveKeychain");
        }
      } else {
        toast({
          title: "Create Hive Acct",
          description: "Oh nooo, some went wrong!",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    } else
      toast({
        title: "Safety Check",
        description: "Please Safely Store Your Keys And Confirm",
        isClosable: true,
        status: "warning",
        duration: 3000,
      });
  };
  return (
    <SingleColLayout>
      {username === "" ? (
        <Formik
          initialValues={{ username: "" }}
          onSubmit={async (values) => {
            if (await checkAcctName(values.username)) {
              setUsername(values.username);
            }
          }}
        >
          {({ isSubmitting, setErrors, setFieldValue }) => (
            <Form>
              <Flex py={6} w="100%" direction="column" alignItems="center">
                <Flex direction="column" justifyContent="center" w="60%">
                  <Text
                    textAlign="center"
                    color="white"
                    fontWeight="bold"
                    fontSize="25px"
                    mb={2}
                  >
                    Hive Account Creation
                  </Text>
                  <Box mt={4}>
                    <InputField
                      onChange={async (e: any) => {
                        setFieldValue("username", e.target.value);
                        if (!(await checkAcctName(e.target.value))) {
                          setErrors({
                            username: "This username already exists",
                          });
                        }
                      }}
                      name="username"
                      label="Username"
                      placeholder="username"
                    />
                  </Box>
                  <Button
                    variantColor="red"
                    my={4}
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Create Me A Hive Acct!
                  </Button>
                </Flex>
              </Flex>
            </Form>
          )}
        </Formik>
      ) : (
        <Flex direction="column" p={6} pb={12}>
          <Text
            textAlign="center"
            color="white"
            fontWeight="bold"
            fontSize="25px"
            mb={2}
          >
            Here Are Your Account Keys
          </Text>
          <Text
            textAlign="center"
            mb={1}
            color="red.500"
            fontWeight="bold"
            fontSize="25px"
          >
            KEEP THEM SAFE!!!
          </Text>
          <Flex
            direction="column"
            backgroundColor="gray.800"
            rounded="md"
            justifyContent="center"
            alignContent="center"
            py={4}
          >
            {DisplayKeys()}
            <Text
              textTransform="capitalize"
              textAlign="center"
              fontSize="25px"
              fontWeight="bold"
              mb={2}
            >
              Master Password
            </Text>
            <Text textAlign="center" color="white" mb={2}>
              {password}
            </Text>
          </Flex>
          <Checkbox
            mt={4}
            onChange={() => {
              setSafetyCheck(!safetyCheck);
            }}
          >
            <Text color="white">
              I have stored the account password and private keys in a safe
              place.
            </Text>
          </Checkbox>
          <Button mt={4} onClick={onContinue}>
            continue
          </Button>
        </Flex>
      )}
    </SingleColLayout>
  );
};
export default withUrqlClient(urqlClient)(NewHiveAcct);
