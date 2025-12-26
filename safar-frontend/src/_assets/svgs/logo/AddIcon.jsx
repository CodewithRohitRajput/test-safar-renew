import React from 'react'

export default function AddIcon({ color = 'white' }) {
  return (
    <div>
      <svg
        width="18"
        height="18"
        viewBox="0 0 10 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.82751 0.994156V8.20468"
          stroke={color}
          strokeWidth="1.20175"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.22217 4.59941H8.43269"
          stroke={color}
          strokeWidth="1.20175"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
