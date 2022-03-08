import React from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";

import App from "./components/App/App";
import "./index.scss";

const serverUrl = "https://obpvum12jc20.usemoralis.com:2053/server";
const appId = "yDkcjJPisNL8YPWPJfYKZkdeHDMOEiXbZPmdvHJ3";

ReactDOM.render(
    <React.StrictMode>
        <MoralisProvider appId={appId} serverUrl={serverUrl}>
            <App />
        </MoralisProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
