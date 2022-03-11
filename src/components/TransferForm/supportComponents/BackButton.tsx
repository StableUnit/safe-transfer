import { Button } from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const BackButton = () => {
    const openMainPage = () => {
        window.open("/");
    };

    return (
        <Button
            variant="text"
            onClick={openMainPage}
            className="transfer-form__button--main-page"
            startIcon={<ArrowBackIcon />}
        >
            Send token
        </Button>
    );
};
