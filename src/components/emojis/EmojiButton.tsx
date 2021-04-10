import { Button, ButtonProps } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { useToast } from "@chakra-ui/toast";
import { Tooltip } from "@chakra-ui/tooltip";
import { OperationContext } from "@urql/core";
import { Form, Formik } from "formik";
import React from "react";
import { MemeEmojiFragment, useAddEmojiMutation } from "src/generated/graphql";

interface EmojiButtonProps extends ButtonProps {
  emoji: MemeEmojiFragment;
  memeId: string;
  refetch: (opts?: Partial<OperationContext>) => void;
}

export const EmojiButton: React.FC<EmojiButtonProps> = (props) => {
  const toast = useToast();
  const { emoji, memeId, refetch, ...buttonProps } = props;
  const [, addEmojiFN] = useAddEmojiMutation();
  const addEmoji = async () => {
    const { data } = await addEmojiFN({ emojiId: emoji.id, memeId });
    if (data?.addEmoji) {
      if (emoji.hasAdded) {
        toast({ title: "Emoji removed", status: "warning" });
      } else {
        toast({ title: "Emoji added", status: "success" });
      }
      refetch({ requestPolicy: "network-only" });
    }
  };
  return emoji.count !== 0 ? (
    <Formik initialValues={{}} onSubmit={addEmoji}>
      {({ isSubmitting }) => (
        <Form>
          <Tooltip label={emoji.name}>
            <Button
              key={emoji.id}
              isActive={emoji.hasAdded}
              isLoading={isSubmitting}
              onClick={addEmoji}
              size="sm"
              m={1}
              {...buttonProps}
            >
              <Image maxHeight="25px" src={emoji.url} /> {emoji.count}
            </Button>
          </Tooltip>
        </Form>
      )}
    </Formik>
  ) : null;
};
