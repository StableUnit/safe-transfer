import React, { useEffect, useLayoutEffect } from "react";

import { GradientHref } from "../../ui-kit/components/GradientHref";
import { SOCIAL_NETWORKS } from "../../ui-kit/components/SocialNetwork/SocialNetwork";

import "./styles.scss";
import { TwitterPosts } from "../TwitterPosts";
import { twitterPosts } from "../Twitter";
import IntroSection from "./supportComponents/IntroSection";
import { useDimensions } from "../../hooks/useDimensions";

const instructionLink =
    "https://medium.com/stableunit/if-it-can-happen-to-experts-it-can-happen-to-you-42a255b44ce#986c";

const getPosition = (width: number) => {
    if (width > 1100) {
        return 250;
    }
    if (width > 900) {
        return 200;
    }
    if (width > 750) {
        return 150;
    }
    if (width > 350) {
        return 10;
    }
    return 0;
};

const IntroPage = () => {
    const { width } = useDimensions();

    const position = getPosition(width);

    return (
        <>
            <div className="intro-page">
                <GradientHref className="intro-page__title">Do safe transfers to never lose tokens</GradientHref>
                <IntroSection right={position} className="c1">
                    <div className="intro-page__section__title">Here's the Problem</div>
                    <div className="intro-page__section__description">
                        There are over $500M worth of tokens are{" "}
                        <GradientHref href="https://medium.com/@0xUsamaro/42a255b44ce" isExternal target="_blank">
                            lost forever
                        </GradientHref>{" "}
                        because they were sent on wrong address, directly to smart-contact, undeployed multisig or wrong
                        chain. It is very stressful to send large sums of crypto and easy to make irreversible mistakes.
                        However every token standard such as erc20 out of box supports a better approve-transferFrom
                        pattern to avoid these mistakes.
                    </div>
                </IntroSection>
                <img className="intro-page__line" src="/line.png" />

                <IntroSection left={position} className="c2">
                    <div className="intro-page__section__title">We have the Solution</div>
                    <div className="intro-page__section__description">
                        <span>
                            Instead of sending tokens directly hope for the best, get your piece of mine with just 3
                            steps:
                        </span>
                        <ol>
                            <li>Approve transfer you like to send</li>
                            <li>Send the link with details to the recipient</li>
                            <li>Recipient confirms transfer. If there’s any mistake - simply cancel the approval.</li>
                        </ol>
                    </div>
                </IntroSection>
                <img className="intro-page__line--rotate" src="/line.png" />
                <IntroSection right={position} className="c3">
                    <div className="intro-page__section__title">How it Works</div>
                    <div className="intro-page__section__description">
                        This simple pattern eliminates any transfer errors, but since wallets don’t support this as part
                        of their functionality, we developed this app. It’s a simple open-source solution that doesn’t
                        require any interaction with 3rd party contacts or services, and works on every evm-compatible
                        blockchain such as ethereum, polygons, binance smart chain, arbitrum, optimism and others. In
                        fact, you can do a safe-transfer pattern without this app directly on etherescan (
                        <GradientHref href={instructionLink} isExternal target="_blank">
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
                </IntroSection>
            </div>
            <TwitterPosts ids={twitterPosts} />
        </>
    );
};

export default IntroPage;
