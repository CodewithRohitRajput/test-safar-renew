"use client"

import React from 'react'
import CustomText from './CustomText'
// import { light } from '@/_assets/themes/themes'

function CustomButton({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  content,
  small_btn = false,
  btncolor,
  logo_path,
  text_classname,
  text_color = 'text-buttonText',
  font_size,
  pill_rounded = false,
  md_round = true,
  xl_round = false,
  padding = 'p-4',
  btnstyle = '',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`flex flex-wrap gap-y-2 justify-center items-center ${btnstyle} ${className} ${
      small_btn == true ? 'p-2' : padding
      } ${
      md_round  
      ? 'rounded-md'
      : xl_round
       ? 'rounded-xl'
        : pill_rounded
          ? 'rounded-full'
           : ''
         } transition-transform transform duration-75 active:scale-95`}

      onClick={onClick}
      disabled={disabled}
      style={{ backgroundColor: btncolor, width: '100%' }}
      {...rest}
    >
      {logo_path && logo_path}
      <CustomText
        primaryfontweight
        fontsize={font_size?.length == 0 ? '15.75px' : font_size}
        content={content}
        // color={light.buttonText}
        className={`${text_classname} ${text_color}`}
      />
    </button>
  )
}

export default CustomButton
