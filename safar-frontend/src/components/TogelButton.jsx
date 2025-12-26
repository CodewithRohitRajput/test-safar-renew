"use client"

import { useState } from 'react'

export default function Toggle({ enabled, onToggle, customClasses = '' }) {
  return (
    <div className={`flex ${customClasses}`}>
      <label className="inline-flex relative items-center mr-5 cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={enabled}
          readOnly
        />
        <div
          onClick={onToggle}
            // className={`w-11 h-5 bg-gray-200 rounded-full peer peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:-top-1 after:-left-[6px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:after:bg-buttonBackground`}
          className={`w-9 h-5 bg-gray-200 rounded-full peer peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-buttonBackground`}
        ></div>
      </label>
    </div>
  )
}
