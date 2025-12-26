import React from 'react'

const CustomRadioButtonGroup = ({
  label,
  name,
  options,
  selectedValue,
  onChange,
  fontSize = '14.17px',
  color = 'text-gray-800'
}) => {
  return (
    <div className="flex flex-row gap-10">
      <label
        className={` ${color} font-nunitobold700 mb-2`}
        style={{ fontSize: fontSize }}
      >
        {label}
      </label>
      <div className="flex flex-wrap gap-4">
        {options.map((option,index) => (
          <div key={index} className="flex items-center">
            <input
              id={option.value}
              name={name}
              type="radio"
              value={option.value}
              checked={selectedValue === option.value}
              onChange={onChange}
              className="hidden peer"
            />
            <label
              htmlFor={option.value}
              className="flex items-center cursor-pointer text-gray-800 font-nunitoregular400"
            >
              <div className="relative flex items-center">
                <div className="w-5 h-5 border-2 border-gray-400 rounded-full peer-checked:border-signinbtnbackground flex items-center justify-center">
                  <div
                    className={`w-3 h-3 rounded-full bg-signinbtnbackground transition-transform transform ${
                      selectedValue === option.value ? 'scale-100' : 'scale-0'
                    }`}
                  />
                </div>
                <span className="ml-2">{option.label}</span>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomRadioButtonGroup
