import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Image } from "@chakra-ui/image";
import { Box, BoxProps, Flex, Text } from "@chakra-ui/layout";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/slider";
import { Collapse } from "@chakra-ui/transition";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Form, Formik } from "formik";
import React from "react";
import { AvatarLink } from "src/components/utils/AvatarLink";
import { UserMemeFragment } from "src/generated/graphql";
import { useHandleMemeHiveVote } from "src/hooks/useHandleHiveVote";
import { ratioToColorGrade } from "src/utils/functions";
import { DownvoteButton } from "./DownvoteButton";
import { UpvoteButton } from "./UpvoteButton";
dayjs.extend(relativeTime);

interface MemeDisplayProps extends BoxProps {
  meme: UserMemeFragment;
}

export const MemeDisplay: React.FC<MemeDisplayProps> = (props) => {
  let { meme } = props;
  const { grade, color } = ratioToColorGrade(meme.ratio);
  const { isOpen: hiveVoteOpen, onToggle: toggleHiveVote } = useDisclosure();
  const handleHiveVote = useHandleMemeHiveVote(meme, meme.user);
  return (
    <Box {...props} rounded="md">
      <Flex
        rounded="md"
        backgroundColor="black"
        justifyContent="center"
        mb={2}
        p={4}
      >
        <Image w="80%" rounded="md" src={meme.url} my={2} />
      </Flex>
      <Flex
        rounded="md"
        backgroundColor="black"
        justifyContent="space-around"
        align="center"
        py={1}
      >
        <Flex justifyContent="space-around" align="center" rounded="md">
          <Box mr={2}>
            <AvatarLink
              userId={meme.user.id}
              size="md"
              src={meme.user.avatar}
            />
          </Box>
          <Box>
            <Text fontSize="md" fontWeight="bold">
              {meme.user.username}
            </Text>
            <Text fontSize="sm">{dayjs(meme.createdAt).fromNow()}</Text>
          </Box>
        </Flex>
        <Text color={color} fontSize="50px" fontWeight="bold">
          {grade}
        </Text>
        <Flex justifyContent="center" alignItems="center">
          <UpvoteButton
            isLoading={hiveVoteOpen}
            meme={meme}
            toggleHiveVote={toggleHiveVote}
            m={1}
          />
          <DownvoteButton m={1} isLoading={hiveVoteOpen} meme={meme} />
        </Flex>
        <Collapse in={hiveVoteOpen}>
          <Formik
            initialValues={{ voteWieght: 100 }}
            onSubmit={async (values) => {
              handleHiveVote(values.voteWieght * 100);
            }}
          >
            {({ isSubmitting, values: { voteWieght }, setFieldValue }) => (
              <Form>
                <Flex mt={4} direction="column">
                  <Flex>
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
                    <Button w="50px" ml={8}>
                      {voteWieght}
                    </Button>
                  </Flex>
                  <Button
                    mt={2}
                    type="submit"
                    colorScheme="blue"
                    isLoading={isSubmitting}
                  >
                    Vote
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </Collapse>
      </Flex>
    </Box>
  );
};
