import { useToast } from "@chakra-ui/toast";

export const useHasVoted = (item: {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}) => {
  const toast = useToast();
  return () => {
    if (item.hasUpvoted || item.hasDownvoted) {
      toast({
        title: "Oops",
        description: "You already voted this meme",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return true;
    } else {
      return false;
    }
  };
};
