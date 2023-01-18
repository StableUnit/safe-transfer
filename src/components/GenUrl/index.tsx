import React from "react";
import { IconButton } from "@mui/material";
import { getShortUrl, handleCopyUrl } from "../../utils/urlGenerator";

import { ReactComponent as ContentCopyIcon } from "../../ui-kit/images/copy.svg";

import "./styles.scss";

interface GenUrlProps {
    genUrl?: string;
    isLoading?: boolean;
    text: string;
}

const GenUrl = React.memo(({ genUrl, isLoading = false, text }: GenUrlProps) => {
    return genUrl ? (
        <div className="gen-url-container">
            <div className="gen-url">
                <div className="gen-url__text">
                    <div className="gen-url__text--title">{text}&nbsp;&nbsp;</div>
                    <a href={genUrl} target="_blank" rel="noreferrer">
                        {getShortUrl(genUrl ?? "")}
                    </a>
                </div>
                <IconButton aria-label="copy" onClick={handleCopyUrl(genUrl ?? "")}>
                    <ContentCopyIcon />
                </IconButton>
            </div>
            {isLoading && (
                <div className="gen-url__loading">
                    Approve transaction is loading, but you already can send the link that can be used after transaction
                    success
                </div>
            )}
        </div>
    ) : null;
});

export default GenUrl;
