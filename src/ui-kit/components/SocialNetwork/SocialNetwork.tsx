import React from "react";

import { ReactComponent as TgIcon } from "../../images/social/tg.svg";
import { ReactComponent as DiscordIcon } from "../../images/social/discord.svg";
import { ReactComponent as MediumIcon } from "../../images/social/medium.svg";
import { ReactComponent as TwitterIcon } from "../../images/social/twitter.svg";
import { ReactComponent as GithubIcon } from "../../images/social/github.svg";

interface SocialNetworkProps {
    name: string;
    width?: number;
    height?: number;
}

const SOCIAL_NETWORKS: Record<string, { href: string; icon: React.ReactNode }> = {
    tg: {
        href: "https://t.me/stableunit",
        icon: TgIcon,
    },
    discord: {
        href: "https://discord.gg/5bzcBtkGvu",
        icon: DiscordIcon,
    },
    medium: {
        href: "https://medium.com/stableunit",
        icon: MediumIcon,
    },
    twitter: {
        href: "https://twitter.com/stableunitdao",
        icon: TwitterIcon,
    },
    github: {
        href: "https://github.com/StableUnit/safe-transfer",
        icon: GithubIcon,
    },
};

export const SocialNetwork = ({ name, width = 20, height = 20 }: SocialNetworkProps) => {
    const data = SOCIAL_NETWORKS[name];
    const Icon = data?.icon;

    return data ? (
        <a href={data.href} target="_blank" rel="noreferrer">
            {/* @ts-ignore */}
            <Icon style={{ width, height }} />
        </a>
    ) : null;
};
