import { Checkbox } from '@mui/material'
import React from 'react'
import CustomText from './CustomText'
import { light } from '@/_assets/themes/themes'

function CustomCheckboxWithLabel({
  content,
  opacity,
  className,
  defaultchecked = true,
  checked_color = light.checkboxbg,
  disabled = false,
  onChange
}) {
  return (
    <div className={`flex  items-center ${className}`}>
      <Checkbox
        style={{ marginLeft: '-10px' }}
        className="m-0 p-0"
        defaultChecked={defaultchecked}
        sx={{
          color: light.checkboxborder,
          '&.Mui-checked': {
            color: checked_color
          }
        }}
        disabled={disabled}
        onChange={onChange}
      />
      <CustomText
        className={`${opacity ? '' : 'opacity-60'} `}
        secondaryfontsize
        secondaryfontweight
        content={content}
      />
    </div>
  )
}

export default CustomCheckboxWithLabel
