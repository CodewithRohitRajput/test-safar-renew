import React from 'react'

export default function ThreedotIcon({ color = '#141414' }) {
  return (
    <div>
      <svg
        width="18"
        height="18"
        viewBox="0 0 13 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0.360474" y="0.238419" width="3" height="3" fill={color} />
        <rect x="4.86047" y="0.238419" width="3" height="3" fill={color} />
        <rect x="9.36047" y="0.238419" width="3" height="3" fill={color} />
      </svg>
    </div>
  )
}
