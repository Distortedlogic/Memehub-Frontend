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
import { Table, Tbody, Td, Tr } from "@chakra-ui/table";
import { useToast } from "@chakra-ui/toast";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { useMeQuery } from "src/generated/graphql";
import { useMakeTradeMutation } from "../../generated/graphql";

interface BuyButtonProps {
  name: string;
  price: number;
  currentPosition: number;
}

export const BuyButton: React.FC<BuyButtonProps> = ({
  name,
  price,
  currentPosition,
}) => {
  const [, makeTradeFN] = useMakeTradeMutation();
  const [{ data: meData, error }] = useMeQuery();
  const router = useRouter();
  const toast = useToast();
  if (error) console.log(error);
  const buy = async (position: number) => {
    if (!meData?.me) {
      router.push("/onboarding/hiveLogin?next=/market/stonks");
    } else {
      if (meData.me.gbp > price * position) {
        const { data, error } = await makeTradeFN({
          name,
          type: "buy",
          position,
        });
        if (!error && data?.makeTrade) {
          const { makeTrade } = data;
          toast({
            title: "Successful Purchase",
            description: `name - ${makeTrade.name}
            price - ${makeTrade.price}
            position - ${makeTrade.position}
            `,
            status: "success",
          });
        } else {
          console.log("error", error);
          toast({
            title: "Something went wrong",
            status: "error",
          });
        }
      } else toast({ title: "you dont have enough GBP", status: "error" });
    }
  };
  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm" m={1}>
          Buy
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody p={1} backgroundColor="black" rounded="md">
          <Formik
            initialValues={{ position: 1 }}
            onSubmit={async (values) => {
              await buy(values.position);
            }}
          >
            {({ isSubmitting, values: { position }, setFieldValue }) => (
              <Form>
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
                  <Table>
                    <Tbody>
                      <Tr>
                        <Td>Balance</Td>
                        <Td isNumeric>{meData?.me?.gbp} GBP</Td>
                      </Tr>
                      <Tr>
                        <Td>Cost</Td>
                        <Td isNumeric>{position * price} GBP</Td>
                      </Tr>
                      <Tr>
                        <Td>New Balance</Td>
                        <Td isNumeric>
                          {meData?.me?.gbp
                            ? meData.me.gbp - position * price
                            : 0}{" "}
                          GBP
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>New Position</Td>
                        <Td isNumeric>{currentPosition + position} GBP</Td>
                      </Tr>
                      <Tr>
                        <Td>Current Position</Td>
                        <Td isNumeric>{currentPosition} GBP</Td>
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
                    Buy
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
