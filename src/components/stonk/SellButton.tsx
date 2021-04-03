import { Button } from "@chakra-ui/button";
import { Flex } from "@chakra-ui/layout";
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
import { useToast } from "@chakra-ui/toast";
import { Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { useMeQuery } from "src/generated/graphql";
import { useMakeTradeMutation } from "../../generated/graphql";

interface SellButtonProps {
  name: string;
  price: number;
}

export const SellButton: React.FC<SellButtonProps> = ({ name }) => {
  const [, makeTradeFN] = useMakeTradeMutation();
  const [{ data: meData, error }] = useMeQuery();
  const toast = useToast();
  const router = useRouter();
  if (error) console.log(error);
  const sell = async (position: number) => {
    if (!meData?.me) {
      router.push("/onboarding/hiveLogin?next=/market/stonks");
    } else {
      const { data, error } = await makeTradeFN({
        name,
        type: "sell",
        position,
      });
      if (!error && data?.makeTrade) {
        const { makeTrade } = data;
        meData.me.gbp += makeTrade.price * makeTrade.position;
        toast({
          title: "Successful Sell",
          description: `name - ${makeTrade.name}
        price - ${makeTrade.price}
        position - ${makeTrade.position}
        GBP - ${meData.me.gbp}
        `,
          status: "success",
        });
      } else {
        toast({
          title: "Something went wrong",
          status: "error",
        });
      }
    }
  };
  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm" m={1}>
          Sell
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody p={1} backgroundColor="black" rounded="md">
          <Formik
            initialValues={{ position: 1 }}
            onSubmit={async (values) => {
              await sell(values.position);
            }}
          >
            {({ isSubmitting, values: { position }, setFieldValue }) => (
              <Flex direction="column">
                <NumberInput
                  onChange={(valueString) =>
                    setFieldValue("position", parseInt(valueString))
                  }
                  defaultValue={position}
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Button
                  isLoading={isSubmitting}
                  mt={2}
                  w="100%"
                  type="submit"
                  colorScheme="red"
                >
                  Sell
                </Button>
              </Flex>
            )}
          </Formik>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
