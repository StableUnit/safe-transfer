import { TokenMetadataType } from "../utils/tokens";

// eslint-disable-next-line no-shadow
export enum Actions {
    AddToken = "ADD_TOKEN",
    SetUISelectedChainId = "SET_UI_SELECTED_CHAIN_ID",
}

export type ActionType =
    | {
          type: Actions.AddToken;
          payload: TokenMetadataType & { chainId: number };
      }
    | {
          type: Actions.SetUISelectedChainId;
          payload: number;
      };

export interface ReducerState {
    newCustomToken?: TokenMetadataType & { chainId: number };
    uiSelectedChainId: number;
}

const reducer = (state: ReducerState, action: ActionType) => {
    const { type, payload } = action;
    switch (type) {
        case Actions.AddToken:
            return {
                ...state,
                newCustomToken: payload,
            };
        case Actions.SetUISelectedChainId:
            return {
                ...state,
                uiSelectedChainId: payload,
            };
        default:
            return state;
    }
};

export default reducer;
