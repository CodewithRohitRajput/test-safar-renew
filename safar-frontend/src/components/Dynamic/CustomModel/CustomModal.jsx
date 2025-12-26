"use client";

import React from 'react';
import { Button, Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CustomModal = ({
  btnVisible,
  open,
  onOpen,
  onClose,
  buttonText = "Open Modal",
  buttonStyle = {},
  modalLabel = "Modal Title",
  children
}) => {
  return (
    <>
      {(onOpen && btnVisible) &&  (
        <Button variant="contained" style={buttonStyle} onClick={onOpen}>
          {buttonText}
        </Button>
      )}

      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="custom-modal-title"
        aria-describedby="custom-modal-description"
      >
        <Box sx={style}>
          {/* Close button top right */}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color:"black",
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography id="custom-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            {modalLabel}
          </Typography>
          <Box id="custom-modal-description">
            {children}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  outline: 'none', // remove default focus outline on modal content
};

export default CustomModal;
