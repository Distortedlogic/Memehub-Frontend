import { useToast } from "@chakra-ui/toast";
import { useMeQuery } from "src/generated/graphql";
import { optimizeImageFile } from "src/utils/functions";
export const useUploadValidation = () => {
  const toast = useToast();
  const [{ data, error, fetching }] = useMeQuery();

  if (error) throw error;
  if (fetching || !data?.me)
    return async (
      _file: File | undefined,
      _postToHive: boolean,
      _title: string
    ) => undefined;
  const { me } = data;
  return async (file: File | undefined, postToHive: boolean, title: string) => {
    if (postToHive && !me.isHive) {
      window.open("https://peakd.com/about/faq", "_blank");
      return undefined;
    } else if (!file) {
      toast({
        description: "Please select a meme :)",
        duration: 1000 * 3,
        isClosable: true,
        status: "warning",
      });
      return undefined;
    } else if (!title) {
      toast({
        description: "Please create a title :)",
        duration: 1000 * 3,
        isClosable: true,
        status: "warning",
      });
      return undefined;
    } else {
      const optFile = await optimizeImageFile(file);
      if (!optFile) {
        toast({
          title: "oh no, something went wrong",
          duration: 3000,
          isClosable: true,
          status: "error",
        });
      }
      return optFile;
    }
  };
};
