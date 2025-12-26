"use client"

import React from 'react'
import CustomText from './CustomText'
import { light } from '@/_assets/themes/themes'

function CustomInput({
  isRequired = false,
  content = '',
  aboveStyle = '',
  type_password = false,
  default_input_type = true,
  set_input_type = '',
  value,
  onchange,
  top_title = '',
  top_title_classname,
  second_top_title_classname,
  second_top_title = '',
  backgroundColor = light.inputbg,
  contentcolor = light.inputtextcolor,
  input_font = 'font-nunitoregular400',
  borderRadius = 'rounded-md',
  icon_path,
  post_icon_path,
  btnparentclassname,
  className,
  border_color = '0.79px solid #D8D8D8',
  onClick,
  custompadding = 'p-2',
  error_text = '',
  textarea_input = false,
  ...rest
}) {
  return (
    <div className={aboveStyle}>
      <div className="flex flex-row justify-between">
        {top_title && (
          <div className="flex justify-start relative">
            <CustomText
              secondaryfontsize
              secondaryfontweight
              content={top_title ? top_title : ''}
              className={`mb-3  ${top_title_classname}`}
            />
            {isRequired && (
              <span className=" absolute ml-0.5 -top-1 left-full text-red-600">
                *
              </span>
            )}
          </div>
        )}
        {second_top_title && (
          <CustomText
            secondaryfontsize
            secondaryfontweight
            content={second_top_title ? second_top_title : ''}
            className={`mb-3  ${second_top_title}`}
          />
        )}
      </div>
      <div
        style={{ backgroundColor, border: border_color }}
        className={`flex ${borderRadius} justify-center items-center pl-2 ${btnparentclassname}`}
      >
        {icon_path && icon_path}
        {textarea_input == false ? (
          <input
            type={
              type_password
                ? 'password'
                : default_input_type
                  ? 'text'
                  : set_input_type
            }
            onClick={onClick}
            style={{
              width: '100%',
              outline: 'none',
              backgroundColor,
              color: contentcolor
            }}
            placeholder={content}
            value={value}
            onChange={onchange}
            className={`${borderRadius} ${custompadding} ${input_font} ${className}`}
            {...rest}
          />
        ) : (
          <textarea
            type={
              type_password
                ? 'password'
                : default_input_type
                  ? 'text'
                  : set_input_type
            }
            onClick={onClick}
            style={{
              width: '100%',
              outline: 'none',
              backgroundColor,
              color: contentcolor
            }}
            placeholder={content}
            value={value}
            onChange={onchange}
            className={`${borderRadius} ${custompadding} ${input_font} ${className}`}
            {...rest}
          />
        )}

        {post_icon_path && post_icon_path}
      </div>
      {error_text?.length > 0 && (
        <div className="flex justify-start my-2">
          <CustomText
            content={error_text}
            className="text-red-500"
            fontsize="12px"
          />
        </div>
      )}
    </div>
  )
}

export default CustomInput
