import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import SendForm from "../SendForm/SendForm";
import ReceiveForm from "../ReceiveForm/ReceiveForm";
import { PageNotFound } from "../PageNotFound";
import RequestForm from "../RequestForm";
import IntroPage from "../IntroPage";

interface Props {
    onConnect: () => void;
}

export const Routes = ({ onConnect }: Props) => (
    <Switch>
        {/* @ts-ignore */}
        <Route exact path="/send">
            <SendForm onConnect={onConnect} />
        </Route>

        {/* @ts-ignore */}
        <Route exact path="/intro">
            <IntroPage />
        </Route>

        {/* @ts-ignore */}
        <Route exact path="/receive">
            <ReceiveForm onConnect={onConnect} />
        </Route>

        {/* @ts-ignore */}
        <Route exact path="/request">
            <RequestForm onConnect={onConnect} />
        </Route>

        {/* @ts-ignore */}
        <Route exact path="/">
            <Redirect to="/intro" />
        </Route>

        <Route path="*">
            <PageNotFound />
        </Route>
    </Switch>
);
