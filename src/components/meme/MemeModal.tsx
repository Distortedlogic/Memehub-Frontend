import { useDisclosure } from "@chakra-ui/hooks";
import { Image, ImageProps } from "@chakra-ui/image";
import { Box, Flex } from "@chakra-ui/layout";
import { Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/modal";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/slider";
import React, { useState } from "react";

const modalSizes = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
];

interface MemeModalProps extends ImageProps {
  url: string;
}

export const MemeModal: React.FC<MemeModalProps> = (props) => {
  const { url, ...imageProps } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = useState(0);
  return (
    <>
      <Image
        _hover={{ cursor: "pointer" }}
        onClick={onOpen}
        src={url}
        {...imageProps}
      />
      <Modal size={modalSizes[size]} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody backgroundColor="black" color="white">
            <Flex m={4} justifyContent="center">
              <Slider
                onChangeEnd={(value) => {
                  setSize(value);
                }}
                max={modalSizes.length - 1}
                min={0}
                step={1}
                defaultValue={0}
              >
                <SliderTrack bg="gray.100" />
                <SliderFilledTrack bg="blue.500" />
                <SliderThumb size={6}>
                  <Box color="green" />
                </SliderThumb>
              </Slider>
            </Flex>
            <Flex justifyContent="center">
              <Image src={url} />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
