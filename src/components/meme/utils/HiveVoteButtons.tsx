import { Button } from "@chakra-ui/button";
import { Box, Flex } from "@chakra-ui/layout";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/slider";
import { useToast } from "@chakra-ui/toast";
import { Tooltip } from "@chakra-ui/tooltip";
import { Collapse } from "@chakra-ui/transition";
import { Form, Formik } from "formik";
import React from "react";
import {
  MemeFragment,
  UserFragment,
  useUpVoteMemeMutation,
} from "src/generated/graphql";
import { useHandleMemeHiveVote } from "src/hooks/useHandleHiveVote";
import { useHasVoted } from "src/hooks/useHasVoted";

interface HiveVoteButtonsProps {
  meme: MemeFragment;
  user: UserFragment;
  isOpen: boolean;
  onToggle: () => void;
}

export const HiveVoteButtons: React.FC<HiveVoteButtonsProps> = ({
  meme,
  user,
  isOpen,
  onToggle,
}) => {
  const toast = useToast();
  const [, upVoteMemeFN] = useUpVoteMemeMutation();
  const handleHiveVote = useHandleMemeHiveVote(meme, user);
  const hasVoted = useHasVoted(meme);
  const handleUpvote = async () => {
    if (!hasVoted()) {
      const { data } = await upVoteMemeFN({ memeId: meme.id });
      if (data?.upVoteMeme) {
        toast({ title: "Upvote Sent", status: "success" });
      }
      onToggle();
    }
  };
  return (
    <Collapse in={isOpen}>
      <Formik
        initialValues={{ voteWieght: 100 }}
        onSubmit={async (values) => {
          handleHiveVote(values.voteWieght * 100);
          onToggle();
        }}
      >
        {({ isSubmitting, values: { voteWieght }, setFieldValue }) => (
          <Form>
            <Flex
              w="100%"
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Flex
                w="80%"
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Flex w="100%">
                  <Slider
                    onChange={(newValue) =>
                      setFieldValue("voteWieght", newValue)
                    }
                    max={100}
                    min={0}
                    step={1}
                    defaultValue={voteWieght}
                  >
                    <SliderTrack bg="gray.100" />
                    <SliderFilledTrack bg="blue.500" />
                    <SliderThumb size={6}>
                      <Box color="green" />
                    </SliderThumb>
                  </Slider>
                  <Tooltip hasArrow label="Hive Voting Power">
                    <Button _focus={{}} size="sm" ml={8}>
                      {voteWieght} VP
                    </Button>
                  </Tooltip>
                </Flex>
                <Button w="100%" mt={2} type="submit" isLoading={isSubmitting}>
                  Upvote on Hive and Memehub
                </Button>
                <Button
                  onClick={handleUpvote}
                  w="100%"
                  mt={2}
                  isLoading={isSubmitting}
                >
                  Upvote on Memehub Only
                </Button>
                <Button
                  onClick={() => onToggle()}
                  w="100%"
                  my={2}
                  isLoading={isSubmitting}
                >
                  Close
                </Button>
              </Flex>
            </Flex>
          </Form>
        )}
      </Formik>
    </Collapse>
  );
};
