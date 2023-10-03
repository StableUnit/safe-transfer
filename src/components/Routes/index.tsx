import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import SendForm from "../SendForm/SendForm";
import ReceiveForm from "../ReceiveForm/ReceiveForm";
import { PageNotFound } from "../PageNotFound";
import RequestForm from "../RequestForm";
import IntroPage from "../IntroPage";
import { PageInMaintenance } from "../PageInMaintenance";

interface Props {
    onConnect: () => void;
}

export const Routes = ({ onConnect }: Props) => (
    <Switch>
        <Route path="*">
            <PageInMaintenance />
        </Route>
    </Switch>
);
