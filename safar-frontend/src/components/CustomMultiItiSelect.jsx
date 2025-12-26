import React from 'react'
import CustomText from './CustomText'
import { light } from '@/_assets/themes/themes'
import { FormControl, Select, MenuItem } from '@mui/material'
import { styled } from '@mui/system'

export default function CustomMultiItiSelect({
  top_title,
  option_data,
  content_destruct,
  selectedValue = [], // This should be an array of IDs
  onChange,
  onOpen,
  multiple = false,
  border_color = '#3B3B3B',
  padding = '0.30rem',
  truncationLimit = 20, // Truncation limit, default to 20 characters
  maxWidth = '300px' // Set a default max width for the select box
}) {
  const CustomFormControl = styled(FormControl)(() => ({
    '& .MuiInputBase-root': {
      borderRadius: '0.27rem',
      padding: padding,
      maxWidth: maxWidth, // Apply max-width to prevent it from growing too much
      overflow: 'hidden',
      textOverflow: 'ellipsis', // Ensure truncation with ellipsis for long text
      whiteSpace: 'nowrap'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: border_color
    }
  }))

  // Normalize selectedValue to always be an array
  const normalizedSelected = Array.isArray(selectedValue) ? selectedValue : (selectedValue ? [selectedValue] : [])

  const renderValue = (selected) => {
    // Normalize selected to always be an array
    const normalizedSelected = Array.isArray(selected) ? selected : (selected ? [selected] : [])
    
    if (!normalizedSelected || normalizedSelected.length === 0) {
      return 'Choose a category' // Default placeholder text
    }

    // Map through selected IDs and display the corresponding names
    const displayText = normalizedSelected
      .map((id) => {
        const item = option_data.find((option) => option.id === id)
        return item ? truncateText(`${item.name}`) : null
      })
      .filter(Boolean)
      .join(', ')

    // Truncate the whole display text if it exceeds the width
    return displayText.length > truncationLimit
      ? `${displayText.substring(0, truncationLimit)}...`
      : displayText
  }

  const truncateText = (text) => {
    return text.length > truncationLimit
      ? `${text.substring(0, truncationLimit)}...`
      : text
  }

  const handleChange = (event) => {
    const value = event.target.value
    if (multiple) {
      // For multiple selection, value is already an array
      onChange(typeof value === 'string' ? value.split(',') : value)
    } else {
      // For single selection, value is a string, convert to array for consistency
      onChange(value)
    }
  }

  return (
    <div className="w-full">
      <CustomText
        content={top_title}
        fontsize="12px"
        secondaryfontweight
        className="mb-2 text-gray-700"
      />
      <CustomFormControl fullWidth>
        <Select
          value={multiple ? normalizedSelected : (normalizedSelected[0] || '')}
          onChange={handleChange}
          onOpen={onOpen}
          multiple={multiple}
          displayEmpty
          renderValue={renderValue}
          sx={{
            '& .MuiSelect-select': {
              padding: '8px 14px',
              fontSize: '14px',
              color: '#374151'
            }
          }}
        >
          {option_data?.map((item, index) => (
            <MenuItem key={index} value={item.id}>
              <CustomText
                content={content_destruct ? content_destruct(item) : item.name}
                fontsize="12px"
                secondaryfontweight
              />
            </MenuItem>
          ))}
        </Select>
      </CustomFormControl>
    </div>
  )
}