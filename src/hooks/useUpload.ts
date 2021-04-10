import { useToast } from "@chakra-ui/toast";
import { CommentOperation } from "@hiveio/dhive";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  useDeleteMemeMutation,
  useGetSignedUrlMutation,
  useMeUploadQuery,
  usePostMemeMutation,
  useSetMemeIsHiveMutation,
} from "src/generated/graphql";
import { HIVE_COMMUNITY } from "src/utils/constants";
import { useUploadValidation } from "./useUploadValidation";
dayjs.extend(relativeTime);
export const useUpload = () => {
  const [{ data, error, fetching }] = useMeUploadQuery();
  const [, deleteMemeFN] = useDeleteMemeMutation();
  const [, getSignedUrlFN] = useGetSignedUrlMutation();
  const [, postMemeFN] = usePostMemeMutation();
  const [, setIsHiveFN] = useSetMemeIsHiveMutation();
  const toast = useToast();
  const validationFN = useUploadValidation();
  if (error) throw error;
  if (fetching || !data?.me)
    return async (
      _file: File | undefined,
      _postToHive: boolean,
      _title: string
    ) => undefined;
  const { me } = data;
  const canHivePost =
    me.lastHivePost && dayjs(me.lastHivePost) > dayjs().subtract(1, "d");
  const canMemehubPost =
    me.lastMemehubPost && dayjs(me.lastMemehubPost) > dayjs().subtract(1, "d");
  return async (
    file: File | undefined,
    postToHive: boolean,
    title: string
  ): Promise<string | undefined> => {
    const optFile = await validationFN(file, postToHive, title);
    if (!optFile) return;
    else {
      const { data } = await getSignedUrlFN({
        path: "memes",
        filename: optFile.name,
      });
      if (!data?.getSignedUrl) {
        toast({
          title: "No signed url was returned",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      } else {
        const resp = await fetch(data.getSignedUrl, {
          method: "PUT",
          body: optFile,
        });
        if (!(resp.status === 200)) return undefined;
        else {
          const { data: postMemeData, error } = await postMemeFN({
            title,
            postToHive,
          });
          if (error) console.log(error);
          if (error || !postMemeData?.postMeme) {
            return undefined;
          } else if (!postToHive) {
            return postMemeData.postMeme.id;
          } else {
            const op: CommentOperation = [
              "comment",
              {
                author: me.username,
                body: `
                \n ![${optFile.name}](${postMemeData.postMeme.url})
                \n Posted with <a href="memehub.lol">Memehub</a>
                `,
                json_metadata: JSON.stringify({
                  tags: "memehub",
                  app: "memehub:beta",
                  format: "markdown+html",
                  community: "memehub",
                }),
                parent_author: "",
                parent_permlink: HIVE_COMMUNITY,
                permlink: optFile.name.split(".")[0],
                title,
              },
            ];
            return new Promise(async (resolve) => {
              await window.hive_keychain.requestBroadcast(
                me.username,
                [op],
                "Posting",
                async (resp: any) => {
                  if (resp.success) {
                    await setIsHiveFN({ memeId: postMemeData.postMeme!.id });
                    resolve(postMemeData.postMeme!.id);
                  } else {
                    await deleteMemeFN({ memeId: postMemeData.postMeme!.id });
                    resolve(undefined);
                  }
                }
              );
            });
          }
        }
      }
    }
  };
};
