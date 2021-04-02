import { Image } from "@chakra-ui/image";
import { Flex } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { urqlClient } from "src/urql/urqlClient";
import { BUCKET_BASE_URL } from "src/utils/constants";
import useAsyncEffect from "use-async-effect";
import { useVerifyEmailMutation } from "../../generated/graphql";
import { SingleColLayout } from "../_singleColLayout";

interface VerifyEmailProps {}

const VerifyEmail: React.FC<VerifyEmailProps> = () => {
  const router = useRouter();
  const toast = useToast();
  const token = router.query.token as string;
  const [, verifyEmailFN] = useVerifyEmailMutation();
  useAsyncEffect(async () => {
    const resp = await verifyEmailFN({ token });
    if (resp.data?.verifyEmail) {
      toast({
        title: "Please login",
        status: "success",
        description: "You have been verified",
      });
      router.push("/onboarding/memehub/login");
    }
  }, [token]);
  return (
    <SingleColLayout>
      <Flex h="80vh" w="100%" justifyContent="center" alignItems="center">
        <Flex direction="column" w="60%" alignItems="center">
          <Image
            h="60vh"
            src={BUCKET_BASE_URL + "/marketing/waitingEmailVerify.jpg"}
          />
        </Flex>
      </Flex>
    </SingleColLayout>
  );
};
export default withUrqlClient(urqlClient)(VerifyEmail);
