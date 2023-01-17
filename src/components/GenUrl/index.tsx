import React from "react";
import { IconButton } from "@mui/material";
import { getShortUrl, handleCopyUrl } from "../../utils/urlGenerator";

import { ReactComponent as ContentCopyIcon } from "../../ui-kit/images/copy.svg";

import "./styles.scss";

interface GenUrlProps {
    genUrl?: string;
    text: string;
}

const GenUrl = React.memo(({ genUrl, text }: GenUrlProps) => {
    return genUrl ? (
        <div className="gen-url">
            <div className="gen-url__text">
                <div className="gen-url__text--title">{text}&nbsp;&nbsp;</div>
                <a href={genUrl} target="_blank" rel="noreferrer">
                    {getShortUrl(genUrl)}
                </a>
            </div>
            <IconButton aria-label="copy" onClick={handleCopyUrl(genUrl)}>
                <ContentCopyIcon />
            </IconButton>
        </div>
    ) : null;
});

export default GenUrl;
