import React from 'react'
import CustomText from './CustomText'
import { light } from '@/_assets/themes/themes'
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material'
import { border, styled } from '@mui/system'

export default function CustomSelect({
  category_name,
  option_data,
  top_title,
  fontSize,
  to_disable = false,
  contentcolor = 'text-inputtextcolor',
  background_color = light.inputbg,
  border_color = '#3B3B3B',
  onChange,
  onOpen,
  content_destruct,
  selectedValue,
  padding = '0.30rem'
}) {
  const CustomFormControl = styled(FormControl)(() => ({
    '& .MuiInputBase-root': {
      borderRadius: '0.27rem',
      padding: padding
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: border_color
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: border_color
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: light.signinbtnbackground
    },
    '& .MuiSelect-select': {
      padding: '0.01rem 0.45rem'
    },
    '& .MuiSvgIcon-root': {
      right: '5px',
      top: '1px'
    }
  }))
  return (
    <div className="flex flex-col  items-start">
      {top_title && (
        <CustomText
          secondaryfontsize
          secondaryfontweight
          content={top_title ? top_title : ''}
          className="mb-3"
        />
      )}
      <CustomFormControl
        variant="outlined"
        className="w-full"
        disabled={to_disable}
      >
        <Select
          //   labelId="custom-select-label"
          //   id="custom-select"
          value={selectedValue}
          //   onChange={handleChange}
          defaultValue={option_data?.[0] || 'NA'}
          displayEmpty
          onOpen={onOpen}
          onChange={(e) => {
            onChange(e.target.value)
          }}
        >
          {option_data.map((item, index) => (
        
            <MenuItem key={index} value={item} >
              {content_destruct ? (
                content_destruct(item)
              ) : (
                <CustomText fontsize={fontSize} content={item} />
              )}
            </MenuItem>
          ))}
        </Select>
      </CustomFormControl>
    </div>
  )
}
