import { SHA256 } from "crypto-js";
import { compress, EImageType } from "image-conversion";
import { StonkFragment } from "src/generated/graphql";
import { FieldError } from "./../generated/graphql";
export const getHash = async (text: string) => SHA256(text).toString();

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// convert upvote percentage to grade and color
export const ratioToColorGrade = (
  ratio: number
): { grade: string; color: string } => {
  switch (true) {
    case ratio >= 0.9:
      return { grade: "A", color: "green.700" };
      break;
    case ratio >= 0.8:
      return { grade: "B", color: "green.200" };
      break;
    case ratio >= 0.7:
      return { grade: "C", color: "yellow.700" };
      break;
    case ratio >= 0.6:
      return { grade: "D", color: "yellow.200" };
      break;
    case ratio >= 0.5:
      return { grade: "E", color: "red.200" };
      break;

    default:
      return { grade: "F", color: "red.700" };
      break;
  }
};

export const toErrorMap = (errors: FieldError[]) => {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });
  return errorMap;
};
export const hashBlob = async (blob: Blob) =>
  SHA256(await new Response(blob).text()).toString();

export const optimizeImageFile = async (
  file: File
): Promise<File | undefined> => {
  let ext = file.name.split(".").pop();
  if (!ext) return;
  let blob: Blob | undefined = undefined;
  if (["jpg", "jpeg", "jpe", "jif", "jfif"].includes(ext)) {
    ext = "jpeg";
    blob = await compress(file, {
      quality: 0.8,
      type: `image/${ext}` as EImageType,
    });
  } else if (["png", "PNG"].includes(ext)) {
    ext = "png";
    blob = await compress(file, {
      quality: 0.8,
      type: `image/${ext}` as EImageType,
    });
  }
  blob = (blob ? blob : file) as Blob | File;
  const hash = await hashBlob(blob);
  return new File([blob], `${hash}.${ext}`, {
    type: `image/${ext}`,
  });
};

export const do_binning = (arr: StonkFragment[], isMarketcap: boolean) => {
  const interval = isMarketcap ? 10000 : 1000;
  const max =
    Math.ceil(
      Math.max(
        ...arr.map((stonk) => (isMarketcap ? stonk.marketcap : stonk.price))
      ) / 1000
    ) * 1000;
  const min = 0;
  var numOfBuckets = (max - min) / interval;
  const bins = Array.from(Array(numOfBuckets).keys()).map((idx) => ({
    minNum: idx,
    maxNum: idx + interval,
    count: 0,
  }));
  //Loop through data and add to bin's count
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    for (var j = 0; j < bins.length; j++) {
      var bin = bins[j];
      if (
        isMarketcap
          ? item.marketcap > bin.minNum && item.marketcap <= bin.maxNum
          : item.price > bin.minNum && item.price <= bin.maxNum
      ) {
        bin.count++;
        break; // An item can only be in one bin.
      }
    }
  }
  return bins;
};
