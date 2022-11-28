import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import SendForm from "../SendForm/SendForm";
import ReceiveForm from "../ReceiveForm/ReceiveForm";

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
        <Route exact path="/receive">
            <ReceiveForm onConnect={onConnect} />
        </Route>

        {/* @ts-ignore */}
        <Route exact path="/">
            <Redirect to="/send" />
        </Route>
    </Switch>
);
