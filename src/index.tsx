import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import { ReactNotifications } from "react-notifications-component";

import App from "./components/App/App";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

import "./index.scss";
import "react-notifications-component/dist/theme.css";
import { initialState, StateContext, DispatchContext } from "./reducer/constants";
import reducer from "./reducer";

const serverUrl = "https://obpvum12jc20.usemoralis.com:2053/server";
const appId = "yDkcjJPisNL8YPWPJfYKZkdeHDMOEiXbZPmdvHJ3";

const AppContainer = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <MoralisProvider appId={appId} serverUrl={serverUrl}>
            <StateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>
                    <ErrorBoundary>
                        <ReactNotifications />
                        <App />
                    </ErrorBoundary>
                </DispatchContext.Provider>
            </StateContext.Provider>
        </MoralisProvider>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <AppContainer />
    </React.StrictMode>,
    document.getElementById("root")
);
