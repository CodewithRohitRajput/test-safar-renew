import React from 'react'

export default function EditIcon({ color = '#141414' }) {
  return (
    <div>
      <svg
        width="18"
        height="18"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.8721 1.60473C10.7152 1.44855 10.529 1.32499 10.3241 1.2412C10.1192 1.15741 9.8998 1.11503 9.67846 1.11653C9.45712 1.11803 9.23826 1.16337 9.03454 1.24993C8.83082 1.33649 8.64627 1.46256 8.49155 1.62085L1.815 8.2974L1 11.4768L4.17942 10.6614L10.856 3.98481C11.0143 3.83016 11.1404 3.64566 11.227 3.44197C11.3136 3.23828 11.3589 3.01945 11.3604 2.79813C11.3619 2.57681 11.3196 2.35739 11.2357 2.15255C11.1519 1.94771 11.0283 1.76151 10.8721 1.60473V1.60473Z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.3009 1.81194L10.6649 4.1759"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.81543 8.29694L4.18169 10.6591"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
