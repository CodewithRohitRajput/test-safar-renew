"use client";

import React from "react";

const Feature = ({ title, imageUrl }) => (
  <>
    <div className="md:h-32 h-auto  flex flex-col items-center">
      <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg mb-4">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text  text-gray-800">{title}</h3>
    </div>
  </>
)

export default Feature;