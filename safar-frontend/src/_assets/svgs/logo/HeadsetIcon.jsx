import React from "react";

const HeadsetIcon = ({ color = "#000", size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <rect x="2" y="14" width="4" height="6" rx="1" />
    <rect x="18" y="14" width="4" height="6" rx="1" />
    <path d="M6 20v1a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-1" />
  </svg>
);

export default HeadsetIcon;
