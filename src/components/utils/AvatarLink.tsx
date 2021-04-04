import { Avatar, AvatarProps } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

interface AvatarLinkProps extends AvatarProps {
  userId: string;
}

export const AvatarLink: React.FC<AvatarLinkProps> = (props) => {
  const { userId, ...avatarProps } = props;
  const router = useRouter();
  return (
    <Avatar
      _hover={{ cursor: "pointer" }}
      border="1px solid white"
      onClcik={() => router.push(`/user/${userId}`)}
      {...avatarProps}
    />
  );
};
