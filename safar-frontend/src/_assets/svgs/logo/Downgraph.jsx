import React from 'react'

export default function Downgraph({ color = '#FF7300' }) {
  return (
    <div>
      <svg
        width="43"
        height="23"
        viewBox="0 0 43 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 2L7.71429 7.5L12.3896 4.5L22.3377 14.5L29.5325 8.5L41 21"
          stroke="url(#paint0_linear_280_6399)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_280_6399"
            x1="42.5"
            y1="20.5"
            x2="-10.5"
            y2="-5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={color} />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
