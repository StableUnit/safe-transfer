import React from "react";
import { TwitterShareButton } from "react-twitter-embed";

import { TwitterPosts } from "../TwitterPosts";

import "./styles.scss";

const twitterPosts = [
    "1595062904679956482",
    "1594459327674425346",
    "1543956221614489601",
    "1511317628576362502",
    "1613088718797295617",
    "1613201006312947712",
    "1614328400071491585",
    "1614569695918841856",
];

const Twitter = React.memo(() => {
    return (
        <div className="twitter">
            <div className="twitter__header">
                <div className="twitter__title">Tell us how you feel about Safe Transfer</div>
                <TwitterShareButton
                    url="https://safe-transfer.stableunit.org/"
                    options={{ text: "#safetransfer is awesome", via: "stableUnit", size: "large" }}
                />
            </div>
            <TwitterPosts ids={twitterPosts} />
        </div>
    );
});

export default Twitter;