import React from "react";

import { GradientHref } from "../../ui-kit/components/GradientHref";
import { SOCIAL_NETWORKS } from "../../ui-kit/components/SocialNetwork/SocialNetwork";

import "./styles.scss";
import { TwitterPosts } from "../TwitterPosts";
import { twitterPosts } from "../Twitter";

const problemLink = "https://medium.com/@0xUsamaro/42a255b44ce";

const IntroPage = () => (
    <>
        <div className="intro-page">
            <div className="intro-page__title">Do safe transfers to never lose tokens</div>
            <div className="intro-page__section">
                <div className="intro-page__section__title">Problem</div>
                <div className="intro-page__section__description">
                    There are over $60M worth of tokens are{" "}
                    <GradientHref href={problemLink} isExternal target="_blank">
                        lost forever
                    </GradientHref>{" "}
                    because they were sent on wrong address, directly to smart-contact, undeployed multisig or wrong
                    chain. It is very stressful to send large sums of crypto and easy to make irreversible mistakes.
                    However every token standard such as erc20 out of box supports a better approve-transferFrom pattern
                    to avoid these mistakes.
                </div>
            </div>

            <div className="intro-page__section">
                <div className="intro-page__section__title">Solution</div>
                <div className="intro-page__section__description">
                    <span>
                        Instead of sending tokens directly hope for the best, get your piece of mine with just 3 steps:
                    </span>
                    <ol>
                        <li>Approve transfer you like to send</li>
                        <li>Send the link with details to the recipient</li>
                        <li>Recipient confirms transfer. If there’s any mistake - simply cancel the approval.</li>
                    </ol>
                </div>
            </div>
            <div className="intro-page__section">
                <div className="intro-page__section__title">How it works</div>
                <div className="intro-page__section__description">
                    This simple pattern eliminates any transfer errors, but since wallets don’t support this as part of
                    their functionality, we developed this app. It’s a simple open-source solution that doesn’t require
                    any interaction with 3rd party contacts or services, and works on every evm-compatible blockchain
                    such as ethereum, polygons, binance smart chain, arbitrum, optimism and others. In fact, you can do
                    a safe-transfer pattern without this app directly on etherescan (
                    <GradientHref href={problemLink} isExternal target="_blank">
                        instruction
                    </GradientHref>
                    ) however with many steps and great inconvenience. It works great with gnosis-safe multisig,
                    hardware wallets and might be a good solution for DAOs, VCs and other cases of large capital
                    transfers.
                </div>
                <div className="intro-page__section__description">
                    Please consider supporting us with your word on{" "}
                    <GradientHref href={SOCIAL_NETWORKS.twitter.href} isExternal target="_blank">
                        twitter
                    </GradientHref>
                </div>
            </div>
        </div>
        <TwitterPosts ids={twitterPosts} />
    </>
);

export default IntroPage;
