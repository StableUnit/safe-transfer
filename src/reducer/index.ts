import Web3 from "web3";

import { TokenMetadataType } from "../utils/tokens";

// eslint-disable-next-line no-shadow
export enum Actions {
    AddToken = "ADD_TOKEN",
    SetCurrentAddress = "SET_CURRENT_ADDRESS",
    SetChainId = "SET_CHAIN_ID",
    SetWeb3 = "SET_WEB3",
    ClearWalletData = "CLEAR_WALLET_DATA",
}

export type ActionType =
    | {
          type: Actions.AddToken;
          payload: TokenMetadataType;
      }
    | {
          type: Actions.SetCurrentAddress;
          payload?: string;
      }
    | {
          type: Actions.SetChainId;
          payload?: number;
      }
    | {
          type: Actions.SetWeb3;
          payload: Web3;
      }
    | {
          type: Actions.ClearWalletData;
          payload?: undefined;
      };

export interface ReducerState {
    newCustomToken?: TokenMetadataType;
    chainId?: number;
    address?: string;
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
        case Actions.SetChainId:
            return {
                ...state,
                chainId: payload,
            };
        case Actions.SetCurrentAddress:
            return {
                ...state,
                address: payload,
            };
        case Actions.SetWeb3:
            return {
                ...state,
                web3: payload,
            };
        case Actions.ClearWalletData:
            return {
                ...state,
                chainId: undefined,
                address: undefined,
                web3: undefined,
            };
        default:
            return state;
    }
};

export default reducer;
