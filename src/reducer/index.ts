import { TokenMetadataType } from "../utils/tokens";

// eslint-disable-next-line no-shadow
export enum Actions {
    AddToken = "ADD_TOKEN",
    SetCurrentAddress = "SET_CURRENT_ADDRESS",
    SetChainId = "SET_CHAIN_ID",
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
          type: Actions.ClearWalletData;
          payload?: undefined;
      };

export interface ReducerState {
    newCustomToken?: TokenMetadataType;
    chainId?: number;
    address?: string;
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
        case Actions.ClearWalletData:
            return {
                ...state,
                chainId: undefined,
                address: undefined,
            };
        default:
            return state;
    }
};

export default reducer;
