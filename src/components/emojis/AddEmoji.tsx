import { Button, ButtonProps } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { SimpleGrid } from "@chakra-ui/layout";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/popover";
import { useToast } from "@chakra-ui/toast";
import { Tooltip } from "@chakra-ui/tooltip";
import { OperationContext } from "@urql/core";
import React from "react";
import { useAddEmojiMutation, useEmojisQuery } from "src/generated/graphql";

interface AddEmojiProps extends ButtonProps {
  memeId: string;
  refetch: (opts?: Partial<OperationContext>) => void;
}

export const AddEmoji: React.FC<AddEmojiProps> = (props) => {
  const { memeId, refetch, ...buttonProps } = props;
  const toast = useToast();
  const [{ fetching, error, data }] = useEmojisQuery();
  const [, addEmojiFN] = useAddEmojiMutation();
  if (error) console.log(error);
  if (fetching || !data?.emojis) return <Button size="sm">Emoji</Button>;
  const emojis = data?.emojis.map((emoji) => (
    <Tooltip key={emoji.name} label={emoji.name}>
      <Image
        onClick={async () => {
          const { data, error } = await addEmojiFN({
            memeId,
            emojiId: emoji.id,
          });
          if (error) console.log(error);
          if (data?.addEmoji) {
            toast({ title: "Emoji added", status: "success" });
            refetch({ requestPolicy: "network-only" });
          }
        }}
        _hover={{ cursor: "pointer" }}
        m={2}
        w="30px"
        src={emoji.url}
      />
    </Tooltip>
  ));
  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm" {...buttonProps}>
          Emoji
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody rounded="md" backgroundColor="black" p={0}>
          <SimpleGrid overflow="auto" maxHeight="30vh" columns={6}>
            {emojis}
          </SimpleGrid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
