import { Box, Flex, Text } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { isBrowser } from "src/utils/constants";

interface ScrollToTopProps {}

export const ScrollToTop: React.FC<ScrollToTopProps> = () => {
  const [showScroll, setShowScroll] = useState(false);
  const browser = isBrowser();
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 3200) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 3200) {
      setShowScroll(false);
    }
  };
  useEffect(() => {
    if (browser) {
      window.addEventListener("scroll", checkScrollTop);
    }
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, [browser]);
  return showScroll ? (
    <Box
      onClick={scrollTop}
      _hover={{ cursor: "pointer" }}
      position="fixed"
      left="43%"
      bottom="20px"
      opacity={0.8}
    >
      <Flex p={2} rounded="md" backgroundColor="black">
        <Text>Back To Top</Text>
      </Flex>
    </Box>
  ) : null;
};
