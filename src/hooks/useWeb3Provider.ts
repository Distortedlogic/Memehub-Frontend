import Web3 from "web3";
import { canUseWeb3 } from "./../utils/constants";
export const useWeb3Provider = () => {
  if (canUseWeb3()) {
    return new Web3(window.web3.currentProvider);
  } else {
    return;
  }
};
