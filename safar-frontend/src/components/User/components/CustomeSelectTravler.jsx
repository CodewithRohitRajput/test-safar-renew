import React from 'react'
// import CustomText from '../../../components/CustomText'
import { light } from '@/_assets/themes/themes'
import { FormControl, Select, MenuItem } from '@mui/material'
import { styled } from '@mui/system'
import CustomText from '@/components/CustomText'

export default function CustomSelectTravler({
  top_title,
  option_data,
  fontSize,
  to_disable = false,
  border_color = '#3B3B3B',
  onChange,
  onOpen,
  content_destruct,
  selectedValue,
  padding = '0.30rem',
  error_text
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
    <div className="flex flex-col items-start">
      {top_title && (
        <CustomText
          content={
            <div>
          
              {top_title}
              <span className="ml-0.5  left-full font-normal text-red-600">
                *
              </span>
            </div>
          }
          className="mb-3"
        />
      )}
      <CustomFormControl
        variant="outlined"
        className="w-full"
        disabled={to_disable}
      >
        <Select
          value={selectedValue}
          displayEmpty
          onOpen={onOpen}
          onChange={(e) => {
            const value = e.target.value // Get the value directly from the event
            onChange(value)
          }}
        >
          {option_data.map((item, index) => (
            <MenuItem key={index} value={item}>
              {content_destruct ? (
                content_destruct(item)
              ) : (
                <CustomText fontsize={fontSize} content={item} />
              )}
            </MenuItem>
          ))}
        </Select>
        {error_text?.length > 0 && (
          <div className="flex justify-start my-2">
            <CustomText
              content={error_text}
              className="text-red-500"
              fontsize="12px"
            />
          </div>
        )}
      </CustomFormControl>
    </div>
  )
}
