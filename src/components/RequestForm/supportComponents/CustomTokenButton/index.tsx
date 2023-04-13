import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { Backdrop, DialogContent, Fade, Modal } from "@mui/material";

import CustomTokenModalContent from "../../../CustomTokenModalContent/CustomTokenModalContent";

import "./styles.scss";

const CustomTokenButton = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <div className="custom-token-button" onClick={handleOpen}>
                <AddIcon />
            </div>
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
                    <DialogContent>
                        <CustomTokenModalContent onClose={handleClose} />
                    </DialogContent>
                </Fade>
            </Modal>
        </>
    );
};

export default CustomTokenButton;
