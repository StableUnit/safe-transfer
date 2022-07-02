import React from "react";
import { ActionType, ReducerState } from "./index";

export const initialState: ReducerState = {
    newCustomToken: undefined,
    walletChainId: undefined,
    walletAddress: undefined,
    web3: undefined,
};

export const StateContext = React.createContext(initialState);
export const DispatchContext = React.createContext<React.Dispatch<ActionType>>(() => null);
