import Web3 from "web3";

let currentAddress: string;
let web3: Web3;

export const setUtilsCurrentAddress = (newAddress: string) => {
    currentAddress = newAddress;
};
export const setUtilsWeb3 = (newWeb3: Web3) => {
    web3 = newWeb3;
};
