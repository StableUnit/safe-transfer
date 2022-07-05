import Web3 from "web3";

import { TokenMetadataType } from "../utils/tokens";

// eslint-disable-next-line no-shadow
export enum Actions {
    AddToken = "ADD_TOKEN",
    AddAddress = "ADD_ADDRESS",
    AddChain = "ADD_CHAIN",
    AddWeb3 = "ADD_WEB3",
    ClearWalletData = "CLEAR_WALLET_DATA",
}

export type ActionType =
    | {
          type: Actions.AddToken;
          payload: TokenMetadataType;
      }
    | {
          type: Actions.AddAddress;
          payload: string;
      }
    | {
          type: Actions.AddChain;
          payload: number;
      }
    | {
          type: Actions.AddWeb3;
          payload: Web3;
      }
    | {
          type: Actions.ClearWalletData;
          payload?: undefined;
      };

export interface ReducerState {
    newCustomToken?: TokenMetadataType;
    walletChainId?: number;
    walletAddress?: string;
    web3?: Web3;
}

const reducer = (state: ReducerState, action: ActionType) => {
    const { type, payload } = action;
    switch (type) {
        case Actions.AddToken:
            return {
                ...state,
                newCustomToken: payload,
            };
        case Actions.AddChain:
            return {
                ...state,
                walletChainId: payload,
            };
        case Actions.AddAddress:
            return {
                ...state,
                walletAddress: payload,
            };
        case Actions.AddWeb3:
            return {
                ...state,
                web3: payload,
            };
        case Actions.ClearWalletData:
            return {
                ...state,
                walletChainId: undefined,
                walletAddress: undefined,
                web3: undefined,
            };
        default:
            return state;
    }
};

export default reducer;
