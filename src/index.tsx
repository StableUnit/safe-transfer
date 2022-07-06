import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import { ReactNotifications } from "react-notifications-component";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import amplitude from "amplitude-js";

import App from "./components/App/App";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

import "./index.scss";
import "react-notifications-component/dist/theme.css";
import { initialState, StateContext, DispatchContext } from "./reducer/constants";
import reducer from "./reducer";

Sentry.init({
    dsn: "https://7a6df39090c749e3a39eb6bce2d5fad8@o922999.ingest.sentry.io/6543522",
    integrations: [new Integrations.BrowserTracing(), new Sentry.Integrations.Breadcrumbs({ console: false })],
    tracesSampleRate: 1.0,
});

amplitude.getInstance().init("33269ec4443fd55fdcb0c426627ec40f");

const AppContainer = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <ErrorBoundary>
                    <ReactNotifications />
                    <App />
                </ErrorBoundary>
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <AppContainer />
    </React.StrictMode>,
    document.getElementById("root")
);
