import { Button } from "@chakra-ui/button";
import { Divider, Flex, Link, Text } from "@chakra-ui/layout";
import { Asset, DynamicGlobalProperties } from "@hiveio/dhive";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { UserFragment } from "src/generated/graphql";
import { hive } from "src/hiveConnection";
import DoubleColLayout from "src/pages/_doubleColLayout";
import useAsyncEffect from "use-async-effect";

interface WalletProps {
  user: UserFragment;
}

export const Wallet: React.FC<WalletProps> = (props) => {
  const { user } = props;
  const router = useRouter();
  const [hiveBalance, setHiveBalance] = useState(0);
  const [hivePowerBalance, setHivePowerBalance] = useState("0");
  const [hbdBalance, setHbdBalance] = useState(0);
  const [hiveSavingsBalance, setHiveSavingsBalance] = useState(0);
  const [hbdSavingsBalance, setHbdSavingsBalance] = useState(0);
  const [dgp, setDGP] = useState<DynamicGlobalProperties | undefined>(
    undefined
  );
  useAsyncEffect(async () => {
    setDGP(await hive.database.getDynamicGlobalProperties());
  }, []);
  useAsyncEffect(async () => {
    if (user.isHive && dgp) {
      const acct = (await hive.database.getAccounts([user.username]))[0];
      if (acct) {
        setHiveBalance(Asset.fromString(acct.balance as string).amount);
        setHivePowerBalance(
          (
            (Asset.fromString(acct.vesting_shares as string).amount *
              Asset.fromString(dgp.total_vesting_fund_hive as string).amount) /
            Asset.fromString(dgp.total_vesting_shares as string).amount
          ).toFixed(2)
        );
        setHbdBalance(Asset.fromString(acct.hbd_balance as string).amount);
        setHiveSavingsBalance(
          Asset.fromString(acct.savings_balance as string).amount
        );
        setHbdSavingsBalance(
          Asset.fromString(acct.savings_hbd_balance as string).amount
        );
      }
    }
  }, [dgp, user]);
  const hiveWallet = user.isHive ? (
    <Flex direction="column">
      <Flex px={6} py={2} justifyContent="space-between" alignItems="center">
        <Flex direction="column">
          <Text fontWeight="bold">HIVE</Text>
          <Text>
            The primary points of the Memehub Platform, eventually will be
            tokenized.
          </Text>
        </Flex>
        <Text fontWeight="bold">{hiveBalance}</Text>
      </Flex>
      <Divider />
      <Flex px={6} py={2} justifyContent="space-between" alignItems="center">
        <Flex direction="column">
          <Text fontWeight="bold">Hive Power (HP)</Text>
          <Text>
            Stake/Power up your HIVE tokens to have special abilities on the
            Hive Blockchain.
          </Text>
        </Flex>
        <Text fontWeight="bold">{hivePowerBalance}</Text>
      </Flex>
      <Divider />
      <Flex px={6} py={2} justifyContent="space-between" alignItems="center">
        <Flex direction="column">
          <Text fontWeight="bold">Hive Backed Dollars (HBD)</Text>
          <Text>semi-pegged to the dollar</Text>
        </Flex>
        <Text fontWeight="bold">{hbdBalance}</Text>
      </Flex>
      <Divider />
      <Flex px={6} py={2} justifyContent="space-between" alignItems="center">
        <Flex direction="column">
          <Text fontWeight="bold">Savings</Text>
          <Text>Balance is subject to 3 days withdraw waiting period.</Text>
        </Flex>
        <Flex direction="column">
          <Text fontWeight="bold">{hiveSavingsBalance} HIVE</Text>
          <Text fontWeight="bold">{hbdSavingsBalance} HBD</Text>
        </Flex>
      </Flex>
    </Flex>
  ) : (
    <Flex direction="column">
      <Text mt={8} mb={4} textAlign="center" fontWeight="bold">
        Want to earn crypto for your dank memes on Memehub?
      </Text>
      <Text mt={4} mb={4} textAlign="center" fontWeight="bold">
        Get your Hive Blockchain Account!
      </Text>
      <Button mt={4} p={0}>
        <Link
          as={Flex}
          w="100%"
          h="100%"
          justifyContent="center"
          alignItems="center"
          _hover={{}}
          _focus={{}}
          href="https://peakd.com/about/faq"
          target="_blank"
        >
          <Text>Hive Faq</Text>
        </Link>
      </Button>
      <Button mt={4} onClick={() => router.push("/onboarding/newHiveAcct")}>
        Get a Hive Acct
      </Button>
    </Flex>
  );

  return (
    <DoubleColLayout>
      <Flex direction="column" h="80vh" p={6}>
        <Flex px={6} py={2} justifyContent="space-between" alignItems="center">
          <Flex direction="column">
            <Text fontWeight="bold">Memehub Points (MHP)</Text>
            <Text>
              The primary points of the Memehub Platform, eventually will be
              tokenized.
            </Text>
          </Flex>
          <Text fontWeight="bold">{user.mhp}</Text>
        </Flex>
        <Divider />
        <Flex px={6} py={2} justifyContent="space-between" alignItems="center">
          <Flex direction="column">
            <Text fontWeight="bold">Good Boy Points (GBP)</Text>
            <Text>
              Points for trading on the stonk Market. In memory of the Nasdanq
              project.
            </Text>
          </Flex>
          <Text fontWeight="bold">{user.gbp}</Text>
        </Flex>
        <Divider />
        {hiveWallet}
      </Flex>
    </DoubleColLayout>
  );
};
