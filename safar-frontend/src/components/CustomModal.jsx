"use client"

import * as React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import CustomButton from './CustomButton'
import { RxCross2 } from 'react-icons/rx'

// Small modal style for simple content (like leads)
const smallStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '500px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 5,
  borderRadius: '10px',
  outline: 'none'
}

// Medium modal style for medium-sized forms (like customize trip)
const mediumStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '92%',
  maxWidth: '950px',  
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 5,
  borderRadius: '10px',
  outline: 'none'
}

// Large modal style for complex forms (like category/location editing)
const largeStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxWidth: '1200px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 5,
  borderRadius: '10px',
  outline: 'none'
}

// Mobile-specific style - full width horizontally, centered vertically
const mobileStyle = {
  position: 'absolute',
  top: '50%',
  left: '0',
  right: '0',
  transform: 'translateY(-50%)',
  width: '100vw',
  maxWidth: 'none',
  margin: '0',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0, // CHANGE: Remove padding for full width
  borderRadius: '15px', // CHANGE: Remove border radius for full width
  outline: 'none',
  maxHeight: '90vh',
  overflow: 'hidden',
  border: '1px solid black' // ADD: Black border line
}

const CustomModal = ({
  open,
  handleClose,
  title = 'Customize Trip 🔥',
  description = '',
  restContent,
  backdropvalue = '0.2',
  padding = 5,
  isMobile = false,
  modalSize = 'small'
}) => {
  // Choose style based on modalSize prop
  const getModalStyle = () => {
    if (isMobile) return mobileStyle;
    if (modalSize === 'large') return largeStyle;
    if (modalSize === 'medium') return mediumStyle;
    return smallStyle;
  };

  const modalStyle = getModalStyle();

  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason === 'backdropClick') return
        handleClose()
      }}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: `rgba(0, 0, 0, ${backdropvalue})`
          }
        }
      }}
    >
      <Box sx={{ ...modalStyle, p: isMobile ? 0 : padding }}>
        {handleClose && (
          <div className="absolute right-0 top-0 z-10">
            <CustomButton
              onClick={handleClose}
              content={''}
              logo_path={<RxCross2 size={30} color="black" />}
            />
          </div>
        )}
        <div className={`custom-scrollbar relative flex max-h-[90vh] flex-col justify-start overflow-y-auto ${
          isMobile ? 'p-4' : 'p-5 text-center'
        }`}>
          <h2 className={`font-nunitoregular400 ${isMobile ? 'text-2xl mb-4' : 'text-[34px]'}`}>
            {title}
          </h2>
          {description && (
            <div className="font-nunitoregular400 text-[12px] mb-4">{description}</div>
          )}
          
          {/* ADD THIS: Black border line after title/description on mobile */}
          {isMobile && (
            <div className="border-t border-black mb-4"></div>
          )}
          
          {restContent}
        </div>
      </Box>
    </Modal>
  )
}

export default CustomModal