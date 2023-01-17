import React from "react";
import { IconButton } from "@mui/material";
import { getShortUrl, handleCopyUrl } from "../../utils/urlGenerator";

import { ReactComponent as ContentCopyIcon } from "../../ui-kit/images/copy.svg";
import { LoaderLine } from "../../ui-kit/components/LoaderLine";

import "./styles.scss";

interface GenUrlProps {
    genUrl?: string;
    isLoading?: boolean;
    text: string;
}

const GenUrl = React.memo(({ genUrl, isLoading = false, text }: GenUrlProps) => {
    return isLoading || genUrl ? (
        <div className="gen-url">
            <div className="gen-url__text">
                <div className="gen-url__text--title">{text}&nbsp;&nbsp;</div>
                {isLoading ? (
                    <LoaderLine width={155} height={18} />
                ) : (
                    <a href={genUrl} target="_blank" rel="noreferrer">
                        {getShortUrl(genUrl ?? "")}
                    </a>
                )}
            </div>
            <IconButton aria-label="copy" onClick={handleCopyUrl(genUrl ?? "")}>
                <ContentCopyIcon />
            </IconButton>
        </div>
    ) : null;
});

export default GenUrl;
