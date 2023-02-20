import React from "react";
import { Fade, Modal } from "@mui/material";

import GenUrl from "../GenUrl";
import { getLongUrl, getShortUrl } from "../../utils/urlGenerator";
import { ReactComponent as CloseIcon } from "../../ui-kit/images/close.svg";
import { useGenUrlPopup } from "../../hooks/useGenUrlPopup";
import { useDevice } from "../../hooks/useDimensions";

import "./styles.scss";

type GenUrlPopupProps = {
    genUrl?: string;
};

const GenUrlPopup = ({ genUrl }: GenUrlPopupProps) => {
    const { isGenUrlPopupVisible, closeGenUrlPopup, canCloseGenUrl } = useGenUrlPopup(genUrl);
    const { isMobile } = useDevice();

    return (
        <Modal
            open={isGenUrlPopupVisible}
            onClose={closeGenUrlPopup}
            aria-labelledby="Your generated url"
            aria-describedby={genUrl}
            BackdropProps={{
                timeout: 500,
                onClick: canCloseGenUrl ? closeGenUrlPopup : () => {},
            }}
            closeAfterTransition
            disableEscapeKeyDown
        >
            <Fade in={isGenUrlPopupVisible}>
                <div className="gen-url-popup">
                    {canCloseGenUrl && <CloseIcon onClick={closeGenUrlPopup} className="gen-url-popup__close" />}
                    <div className="gen-url-popup__title">
                        Transaction is in progress, but you can already share generated link:
                    </div>
                    <GenUrl genUrl={genUrl} text="" linkText={isMobile ? getShortUrl(genUrl) : getLongUrl(genUrl)} />
                </div>
            </Fade>
        </Modal>
    );
};

export default GenUrlPopup;
