import { TokenMetadataType } from "../utils/tokens";

// eslint-disable-next-line no-shadow
export enum Actions {
    AddToken = "ADD_TOKEN",
}

export type ActionType = {
    type: Actions.AddToken;
    payload: TokenMetadataType & { chainId: number };
};

export interface ReducerState {
    newCustomToken?: TokenMetadataType & { chainId: number };
}

const reducer = (state: ReducerState, action: ActionType) => {
    const { type, payload } = action;
    switch (type) {
        case Actions.AddToken:
            return {
                ...state,
                newCustomToken: payload,
            };
        default:
            return state;
    }
};

export default reducer;
