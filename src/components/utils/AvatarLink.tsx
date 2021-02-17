import { Avatar, AvatarProps } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

type AvatarLinkProps = {
  userId: string;
} & AvatarProps;

export const AvatarLink: React.FC<AvatarLinkProps> = (props) => {
  const { userId, ...other } = props;
  return (
    <NextLink href={`/user/${userId}`}>
      <Avatar
        _hover={{ cursor: "pointer" }}
        border="1px solid white"
        {...other}
      />
    </NextLink>
  );
};
