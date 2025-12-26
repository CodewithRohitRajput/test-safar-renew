"use client"

// import { light } from '@/_assets/themes/themes'
import React from 'react'

function CustomText({
  primaryfontweight = false,
  secondaryfontweight = false,
  primaryfontsize = false,
  secondaryfontsize = false,
  btnfontsize = false,
  fontsize = '',
  content,
  className = '',
  lineHeight = '19.33px',
  ...rest
}) {
  return (
    <div
      className={`${
        primaryfontweight
          ? 'font-nunitobold700'
          : secondaryfontweight
            ? 'font-nunitosemiBold600'
            : 'font-nunitoregular400'
      } ${className} `}
      style={{
        lineHeight: lineHeight,
        letterSpacing: '-0.05px',
        fontSize: primaryfontsize
          ? '25.2px'
          : secondaryfontsize
            ? '14.17px'
            : btnfontsize
              ? '15.75px'
              : `${fontsize}`
      }}
      {...rest}
    >
      {content}
    </div>
  )
}

export default CustomText
