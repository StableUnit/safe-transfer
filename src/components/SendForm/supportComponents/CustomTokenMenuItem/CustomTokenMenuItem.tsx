import React from "react";
import { Backdrop, Fade, MenuItem, Modal } from "@mui/material";
import { NetworkType } from "../../../../utils/network";
import CustomTokenModalContent from "../CustomTokenModalContent/CustomTokenModalContent";

import "./CustomTokenMenuItem.scss";

interface CustomTokenMenuItemProps {
    networkName: NetworkType;
}

const CustomTokenMenuItem = ({ networkName }: CustomTokenMenuItemProps) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className="custom-token-menu-item">
            <MenuItem value="custom-value" onClick={handleOpen}>
                Add custom token
            </MenuItem>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <CustomTokenModalContent networkName={networkName as NetworkType} onClose={handleClose} />
                </Fade>
            </Modal>
        </div>
    );
};

export default CustomTokenMenuItem;
