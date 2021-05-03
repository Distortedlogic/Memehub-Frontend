import { Button, ButtonProps } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { Flex, Text } from "@chakra-ui/layout";
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/number-input";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/popover";
import { Table, Tbody, Td, Tr } from "@chakra-ui/table";
import { useToast } from "@chakra-ui/toast";
import { Tooltip } from "@chakra-ui/tooltip";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import {
  InvestmentFragment,
  RedditMemeFragment,
  useInvestMutation,
  useMeQuery,
} from "src/generated/graphql";

interface InvestButtonProps extends ButtonProps {
  meme: RedditMemeFragment;
  investmentData: InvestmentFragment | undefined | null;
  setInvestmentData: React.Dispatch<
    React.SetStateAction<InvestmentFragment | undefined | null>
  >;
}

export const InvestButton: React.FC<InvestButtonProps> = (props) => {
  const { meme, investmentData, setInvestmentData, ...buttonProps } = props;
  const [, investFN] = useInvestMutation();
  const [{ data: meData, error }] = useMeQuery();
  const toast = useToast();
  const router = useRouter();
  if (error) console.log(error);
  const buy = async (betSize: number, target: number) => {
    if (!meData?.me) {
      router.push("/onboarding/hiveLogin");
    } else {
      const { data, error } = await investFN({
        betSize,
        redditId: meme.redditId,
        target,
        type: "invest",
      });
      if (error) console.log(error);
      if (data?.invest) {
        setInvestmentData(data.invest);
        if (data.invest.profitLoss > 0) {
          toast({
            title: "Nice Bet!",
            status: "success",
            description: `You won ${data.invest.profitLoss} GBP!`,
          });
        } else {
          toast({
            title: "Oh No!",
            status: "error",
            description: `You lost ${data.invest.profitLoss} GBP :(`,
          });
        }
      } else {
        toast({ title: "oh no", status: "error" });
      }
    }
  };
  const InvestmentResult = () => (
    <Table>
      <Tbody>
        <Tr>
          <Td>Bet Size</Td>
          <Td isNumeric>{investmentData?.betSize} GBP</Td>
        </Tr>
        <Tr>
          <Td>Target Percentile</Td>
          <Td isNumeric>{investmentData?.target}</Td>
        </Tr>
        <Tr>
          <Td>Meme's Percentile</Td>
          <Td isNumeric>{investmentData?.percentile.toFixed(2)}</Td>
        </Tr>
        <Tr>
          <Td>Profit/Loss</Td>
          <Td isNumeric>{investmentData?.profitLoss} GBP</Td>
        </Tr>
      </Tbody>
    </Table>
  );
  const InvestForm = () => (
    <Formik
      initialValues={{ betSize: 5, target: 0.5 }}
      onSubmit={async (values) => {
        await buy(values.betSize, values.target);
      }}
    >
      {({ isSubmitting, values: { betSize, target }, setFieldValue }) => {
        const isYolo = betSize === meData?.me?.gbp;
        return (
          <Form>
            <Flex direction="column">
              <Flex m={1} justifyContent="space-between" alignItems="center">
                <Text>Bet Size in GBP</Text>
                <Tooltip label="Bet it all, and get a 2x multiplier!">
                  <Checkbox
                    isChecked={isYolo}
                    onChange={() => {
                      isYolo
                        ? setFieldValue("betSize", 5)
                        : setFieldValue("betSize", meData?.me?.gbp);
                    }}
                  >
                    <Text>Yolo</Text>
                  </Checkbox>
                </Tooltip>
              </Flex>
              <NumberInput
                allowMouseWheel
                onChange={(valueString) =>
                  setFieldValue("betSize", parseInt(valueString))
                }
                defaultValue={betSize}
                value={betSize}
                min={5}
                step={5}
                max={meData?.me?.gbp}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Flex mt={2} justifyContent="center" alignItems="center">
                <Text>This meme is better than XX% of memes</Text>
              </Flex>
              <NumberInput
                allowMouseWheel
                onChange={(valueString) =>
                  setFieldValue("target", parseFloat(valueString))
                }
                defaultValue={target}
                min={0.5}
                max={0.99}
                step={0.01}
                mt={2}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Table>
                <Tbody>
                  <Tr>
                    <Td>Potential Profit</Td>
                    <Td isNumeric>
                      {Math.round((betSize * target) / (1 - target)) *
                        (isYolo ? 2 : 1)}{" "}
                      GBP
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Current Balance</Td>
                    <Td isNumeric>{meData?.me?.gbp} GBP</Td>
                  </Tr>
                </Tbody>
              </Table>
              <Button
                isLoading={isSubmitting}
                mt={2}
                w="100%"
                type="submit"
                colorScheme="green"
              >
                {isYolo ? "YOLO!" : "Invest"}
              </Button>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm" {...buttonProps}>
          {investmentData ? "Trade Data" : "Invest"}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody p={1} backgroundColor="black" rounded="md">
          {investmentData ? <InvestmentResult /> : <InvestForm />}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
