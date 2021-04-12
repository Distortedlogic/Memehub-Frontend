import { useToast } from "@chakra-ui/toast";

export const useClipboard = () => {
  const toast = useToast();
  return async (setFieldValue: any) => {
    //@ts-ignore
    const clipboarditem = await navigator.clipboard.read();
    let imgBlob: Blob | undefined = undefined;
    let found = false;
    try {
      await Promise.all(
        ["image/png", "image/gif", "image/jpeg"].map(async (type) => {
          try {
            imgBlob = await clipboarditem[0].getType(type);
          } catch (error) {
            return;
          }
          throw new Error("found image");
        })
      );
    } catch (error) {
      found = true;
    }
    console.log("found", found);
    if (found) {
      const file = new File([imgBlob!], "clipboard.png", {
        type: imgBlob!.type,
      });
      setFieldValue("file", file);
      setFieldValue("url", URL.createObjectURL(file));
    } else {
      toast({
        title: "Memehub did not find an image in your clipboard!",
        isClosable: true,
        duration: 3000,
        status: "error",
      });
    }
  };
};
