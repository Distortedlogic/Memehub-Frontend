import { Image } from "@chakra-ui/image";
import { Flex, FlexProps, Link } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import React from "react";
import { MemeFragment, UserFragment } from "src/generated/graphql";
import { BUCKET_BASE_URL, HIVE_COMMUNITY } from "src/utils/constants";

interface PeakdMemeLinkProps extends FlexProps {
  meme: MemeFragment;
  user: UserFragment;
  imgHeight: string;
}

export const PeakdMemeLink: React.FC<PeakdMemeLinkProps> = (props) => {
  const { meme, user, imgHeight, ...flexProps } = props;
  if (!meme.isHive) return <></>;
  return (
    <Flex {...flexProps} justifyContent="center" alignItems="center">
      <Link
        _focus={{}}
        _hover={{ cursor: "pointer" }}
        href={`https://peakd.com/${HIVE_COMMUNITY}/@${user.username}/${
          meme.url.split("/").pop()?.split(".")[0]
        }`}
        target="_blank"
      >
        <Tooltip label="View on Peakd">
          <Image h={imgHeight} src={BUCKET_BASE_URL + "/icons/peakd.png"} />
        </Tooltip>
      </Link>
    </Flex>
  );
};
