import { useToast } from "@chakra-ui/toast";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Profile } from "src/components/user/Profile";
import { urqlClient } from "src/urql/urqlClient";
import { useUserProfileQuery } from "../../../generated/graphql";

interface UserProfileProps {}

const UserProfile: React.FC<UserProfileProps> = () => {
  const toast = useToast();
  const router = useRouter();
  const [{ data, error, fetching }] = useUserProfileQuery({
    variables: { userId: router.query.userId as string },
  });
  if (error) {
    console.log("error", error);
    toast({ description: JSON.stringify(error), isClosable: true });
  }
  if (fetching || !data?.user) {
    return <></>;
  }
  return <Profile user={data.user} />;
};
export default withUrqlClient(urqlClient)(UserProfile);
