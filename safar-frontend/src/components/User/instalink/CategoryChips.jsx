"use client"

import React from 'react'

const CategoryChips = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="mb-6">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-2 pt-2 -mx-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
              selectedCategory === category.id
                ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-300 hover:bg-orange-50 hover:shadow-md'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryChips