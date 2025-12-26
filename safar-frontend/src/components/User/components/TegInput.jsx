import React, { useState } from 'react'

const TagInput = ({ tags, setTags, handleActivitiesChange }) => {
  const [userInput, setUserInput] = useState('')

  const handleInputChange = (e) => {
    setUserInput(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
         
      if (userInput.trim() !== '' && !tags.includes(userInput.trim())) {
        const updatedTags = [...tags, userInput.trim()]
        setTags(updatedTags)
          setUserInput('')
        handleActivitiesChange(updatedTags)
      
      } 
       setUserInput('')
    

      // Debugging: log the input and tags to verify
    }
  }

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove)
    setTags(updatedTags)
    handleActivitiesChange(updatedTags)
  }

  return (
    <div>
      <div
        className="flex items-center flex-wrap border border-gray-300 p-2 rounded-md"
        onClick={() => document.getElementById('tagInput').focus()}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 mr-2 rounded-full bg-blue-100 text-blue-800"
          >
            {tag}
            <button
              className="ml-2 text-blue-500 hover:text-blue-700"
              onClick={() => removeTag(tag)}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          id="tagInput"
          type="text"
          className="border-none focus:outline-none"
          placeholder="Rafting, Trekking etc"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}

export default TagInput
