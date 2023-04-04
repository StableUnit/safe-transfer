import React from "react";
import { TwitterShareButton } from "react-twitter-embed";

import { TwitterPosts } from "../TwitterPosts";

import "./styles.scss";

export const twitterPosts = [
    "1618696780761415680",
    "1623035727654035456",
    "1511317628576362502",
    "1543956221614489601",
    "1594459327674425346",
    "1595062904679956482",
    "1613088718797295617",
    "1613201006312947712",
    "1614328400071491585",
    "1614567537462882306",
    "1617836771357917184",
    "1619699902405292033",
    "1619716983800623106",
    "1619900299208163328",
    "1619951155320332288",
];

const Twitter = React.memo(() => {
    return (
        <div className="twitter">
            <div className="twitter__header">
                <div className="twitter__title">Tell us how you feel about Safe Transfer</div>
                <TwitterShareButton
                    url="https://safetransfer.cash/"
                    options={{ text: "#safetransfer is awesome", via: "stableUnit", size: "large" }}
                />
            </div>
            <TwitterPosts ids={twitterPosts} />
        </div>
    );
});

export default Twitter;
