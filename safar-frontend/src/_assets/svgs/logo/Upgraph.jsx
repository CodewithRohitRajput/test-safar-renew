import React from 'react'

export default function Upgraph({ color = '#2F8506' }) {
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
          d="M2 21L7.71429 15.5L12.3896 18.5L22.3377 8.5L29.5325 14.5L41 2"
          stroke="url(#paint0_linear_280_6381)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_280_6381"
            x1="42.5"
            y1="2.5"
            x2="-10.5"
            y2="28"
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
