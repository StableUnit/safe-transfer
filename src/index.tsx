import React from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import { ReactNotifications } from "react-notifications-component";

import App from "./components/App/App";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

import "./index.scss";
import "react-notifications-component/dist/theme.css";

const serverUrl = "https://obpvum12jc20.usemoralis.com:2053/server";
const appId = "yDkcjJPisNL8YPWPJfYKZkdeHDMOEiXbZPmdvHJ3";

ReactDOM.render(
    <React.StrictMode>
        <MoralisProvider appId={appId} serverUrl={serverUrl}>
            <ErrorBoundary>
                <ReactNotifications />
                <App />
            </ErrorBoundary>
        </MoralisProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
