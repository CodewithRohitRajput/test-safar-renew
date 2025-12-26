import React from 'react'

export default function SearchIcon({ color = 'black' }) {
  return (
    <div>
      <svg
        width="18"
        height="18"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.5">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.69353 12.5352C12.4234 11.375 13.6959 8.22157 12.5357 5.49174C11.3755 2.7619 8.22208 1.48942 5.49225 2.64957C2.76241 3.80972 1.48993 6.96318 2.65008 9.69302C3.81024 12.4229 6.9637 13.6953 9.69353 12.5352Z"
            stroke={color}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.3902 11.3896L15.5555 15.5555"
            stroke={color}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  )
}
