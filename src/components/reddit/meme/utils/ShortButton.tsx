import { Button, ButtonProps } from "@chakra-ui/button";
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
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import {
  InvestmentFragment,
  RedditMemeFragment,
  useInvestMutation,
  useMeQuery,
} from "src/generated/graphql";

interface ShortButtonProps extends ButtonProps {
  meme: RedditMemeFragment;
  investmentData: InvestmentFragment | undefined | null;
  setInvestmentData: React.Dispatch<
    React.SetStateAction<InvestmentFragment | undefined | null>
  >;
}

export const ShortButton: React.FC<ShortButtonProps> = (props) => {
  const { meme, investmentData, setInvestmentData, ...buttonProps } = props;
  const [, investFN] = useInvestMutation();
  const [{ data: meData, error }] = useMeQuery();
  const toast = useToast();
  const router = useRouter();
  if (error) console.log(error);
  const short = async (betSize: number) => {
    if (!meData?.me) {
      router.push("/onboarding/hiveLogin");
    } else {
      const { data, error } = await investFN({
        betSize,
        redditId: meme.redditId,
        type: "short",
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
      initialValues={{ betSize: 5 }}
      onSubmit={async (values) => {
        await short(values.betSize);
      }}
    >
      {({ isSubmitting, values: { betSize }, setFieldValue }) => (
        <Form>
          <Flex direction="column">
            <Flex mt={1} justifyContent="center" alignItems="center">
              <Text>Betting this meme is in the bottom half.</Text>
            </Flex>
            <Flex mt={1} justifyContent="center" alignItems="center">
              <Text>WARNING: Shorting can be dangerous.</Text>
            </Flex>
            <Flex mt={1} justifyContent="center" alignItems="center">
              <Text>Bet Size in GBP</Text>
            </Flex>
            <NumberInput
              allowMouseWheel
              onChange={(valueString) =>
                setFieldValue("betSize", parseInt(valueString))
              }
              defaultValue={betSize}
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
            <Table>
              <Tbody>
                <Tr>
                  <Td>Potential Profit</Td>
                  <Td isNumeric>{betSize} GBP</Td>
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
              colorScheme="red"
            >
              Short
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm" {...buttonProps}>
          {investmentData ? "Trade Data" : "Short"}
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
