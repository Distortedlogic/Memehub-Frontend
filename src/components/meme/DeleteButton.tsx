import { Button, ButtonProps } from "@chakra-ui/button";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/popover";
import { useToast } from "@chakra-ui/toast";
import React from "react";
import { MemeFragment, useDeleteMemeMutation } from "src/generated/graphql";

interface DeleteButtonProps extends ButtonProps {
  meme: MemeFragment;
}

export const DeleteButton: React.FC<DeleteButtonProps> = (props) => {
  const { meme, ...buttonProps } = props;
  const [, deleteFN] = useDeleteMemeMutation();
  const toast = useToast();
  const onClick = async () => {
    const { data, error } = await deleteFN({ memeId: meme.id });
    if (error) console.log("error", error);
    if (data?.deleteMeme) {
      toast({ title: "meme deleted", status: "error" });
    }
  };
  return (
    <Popover>
      <PopoverTrigger>
        <Button m={1} size="sm" {...buttonProps}>
          <DeleteIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody rounded="md" backgroundColor="black" size="sm" p={0}>
          <Button w="100%" onClick={onClick}>
            Confirm
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
