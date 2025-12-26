"use client";
import { Backdrop, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

const OverLaySpinner = () => {
  const to_show_loader = useSelector((state) => state.global.to_show_loader) || false;
  
  return (
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
      open={to_show_loader}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default OverLaySpinner;
