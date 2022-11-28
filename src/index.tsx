import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import { ReactNotifications } from "react-notifications-component";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import amplitude from "amplitude-js";
import { BrowserRouter } from "react-router-dom";

import App from "./components/App/App";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

import "./index.scss";
import "react-notifications-component/dist/theme.css";
import { initialState, StateContext, DispatchContext } from "./reducer/constants";
import reducer from "./reducer";

const serverUrl = "https://obpvum12jc20.usemoralis.com:2053/server";
const appId = "yDkcjJPisNL8YPWPJfYKZkdeHDMOEiXbZPmdvHJ3";

Sentry.init({
    dsn: "https://7a6df39090c749e3a39eb6bce2d5fad8@o922999.ingest.sentry.io/6543522",
    integrations: [new Integrations.BrowserTracing(), new Sentry.Integrations.Breadcrumbs({ console: false })],
    tracesSampleRate: 1.0,
});

amplitude.getInstance().init("33269ec4443fd55fdcb0c426627ec40f");

const AppContainer = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <MoralisProvider appId={appId} serverUrl={serverUrl}>
            <StateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>
                    <ErrorBoundary>
                        <ReactNotifications />
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
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
