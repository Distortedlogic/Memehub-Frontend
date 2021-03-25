import { Client } from "@hiveio/dhive";
const createHiveConnection = () => {
  const hiveLive = new Client([
    "https://api.hivekings.com",
    "https://anyx.io",
    "https://api.openhive.network",
  ]);
  hiveLive.database.getVersion().then((res) => {
    // @ts-ignore
    if (res.blockchain_version !== "0.23.0") {
      hiveLive.updateOperations(true);
    }
  });
  return hiveLive;
};

export const hive = createHiveConnection();
