import { ethers } from "ethers";
import Web3 from "web3";
import { networkInfo, networkToId, NetworkType } from "./network";
import { rpcList } from "./rpc";

export const NETWORK_TYPE = "matic";
export const NETWORK_TYPE_CODE = 137;

export const getShortAddress = (address: string | null) =>
    address ? `${address.slice(0, 6)}...${address.slice(address.length - 3)}` : "";

export const isAddress = (address?: string) => address?.startsWith("0x") || address?.includes(".eth");

export const ensToAddress = async (chain: NetworkType, ens?: string) => {
    console.log(chain, ens);
    if (ens?.includes(".eth")) {
        // const rpc = networkInfo[chain].rpcUrls[0];
        // console.log(rpc);
        const provider = ethers.providers.getDefaultProvider();
        console.log(provider);
        // console.log(provider);
        // const signer = provider.getSigner();
        // console.log(signer);
        // console.log(await provider.getResolver(ens));
        // console.log(await signer.resolveName(ens));
        // const web3 = rpcList[chain];
        // console.log("web3", rpc, web3);
        // const ethersName = await ethers.getDefaultProvider(rpc).resolveName(ens);
        // console.log(ethersName);
        //
        // const web3Name = await web3.eth.ens.getAddress(ens);
        // console.log(web3Name);

        return provider.resolveName(ens);
    }

    return ens;
};
