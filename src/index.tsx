import React, { useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import { ReactNotifications } from "react-notifications-component";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import amplitude from "amplitude-js";
import { BrowserRouter } from "react-router-dom";

import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, goerli, optimism, bsc, fantom, avalanche } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import App from "./components/App/App";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { initialState, StateContext, DispatchContext } from "./reducer/constants";
import reducer from "./reducer";
import { wagmiCustomNetworks } from "./utils/network";

import "./index.scss";
import "react-notifications-component/dist/theme.css";

if (process.env.REACT_APP_ENV === "production" || process.env.REACT_APP_ENV === "beta") {
    Sentry.init({
        dsn: "https://7a6df39090c749e3a39eb6bce2d5fad8@o922999.ingest.sentry.io/6543522",
        integrations: [new Integrations.BrowserTracing(), new Sentry.Integrations.Breadcrumbs({ console: false })],
        tracesSampleRate: 1.0,
    });
}

amplitude.getInstance().init("33269ec4443fd55fdcb0c426627ec40f");

const redirectFrom = "safe-transfer.stableunit.org";
const redirectTo = "safetransfer.cash";

const AppContainer = () => {
    useEffect(() => {
        if (window?.location?.host === redirectFrom) {
            window.open(window.location.href.replace(redirectFrom, redirectTo), "_self");
        }
    }, []);

    const [state, dispatch] = useReducer(reducer, initialState);

    const chains = [
        mainnet,
        goerli,
        optimism,
        bsc,
        polygon,
        fantom,
        avalanche,
        wagmiCustomNetworks.cronos,
        wagmiCustomNetworks.boba,
        wagmiCustomNetworks.aurora,
        wagmiCustomNetworks.harmony,
    ];

    const { provider, webSocketProvider } = configureChains(chains, [
        infuraProvider({ apiKey: process.env.REACT_APP_INFURA_KEY ?? "" }),
        publicProvider(),
    ]);

    const client = createClient({
        autoConnect: true,
        connectors: [
            new MetaMaskConnector({ chains }),
            new WalletConnectConnector({
                chains,
                options: {
                    qrcode: true,
                },
            }),
        ],
        provider,
        webSocketProvider,
    });

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <ErrorBoundary>
                    <ReactNotifications />
                    <BrowserRouter>
                        <WagmiConfig client={client}>
                            <App />
                        </WagmiConfig>
                    </BrowserRouter>
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
