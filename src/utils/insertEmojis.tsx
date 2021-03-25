import { Image } from "@chakra-ui/core";
import React from "react";
import { EmojiFragment } from "../generated/graphql";

// inserts emojis into text ie :lol: -> image
export const insertEmojis = (text: string, emojis: EmojiFragment[]) => {
  let elements: (JSX.Element | string)[] = [];
  let noEmojisFound = true;
  elements.push(
    text.split(" ").reduce((prev, word) => {
      if (word.startsWith(":") && word.endsWith(":")) {
        const emoji = emojis.filter(
          (emoji) => emoji.name === word.slice(1, word.length - 1)
        )[0];
        if (emoji) {
          noEmojisFound = false;
          elements.push(prev);
          elements.push(<Image key={emoji.name} size="50px" src={emoji.url} />);
          return "";
        } else return word;
      } else {
        return prev + word + " ";
      }
    }, "")
  );
  return noEmojisFound ? text : elements;
};
