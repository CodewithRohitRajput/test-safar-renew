import React, { useState } from 'react'

import CategoryPageCard from '../components/CategoryPageCard'
import { useSelector } from 'react-redux'

const TravelCategories = () => {
    const [imageLoaded, setImageLoaded] = useState([]);

      const categories = useSelector((state) => state.global.categories) || []




const handleImageLoaded = (index) => {
  setImageLoaded((prev) => {
    const updated = [...prev];
    updated[index] = true;
    return updated;
  });
};

  return (
    <div className=" mx-auto md:p-6 ">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
        Discover Group Travel by 
          <span className="text-orange-500"> Category</span>
        </h2>
        <p className="text-gray-600 mb-8">
        Discover curated categories with Safar Wanderlust for adventures that inspire and connect.
        </p>
      </div>

      {/* Categories Grid */}
      <div className=" sm:grid md:grid lg:gird md:mx-28 sm:mx-10  lg:grid-cols-4  md:grid-cols-3 sm:grid-cols-2  hidden gap-4   ">
        {categories.map((category, index) => (
          <CategoryPageCard
            key={category.id}
            id={category.id}
            title={category.name}
            route_map={category.route_map}
            description={category.short_description}
            image={category.image}
            blurLevel={0}
            imageLoaded={imageLoaded[index] || false}
            handleImageLoaded={handleImageLoaded}
            index={index}
          />
        ))}
      </div>
      <div className=" md:hidden  flex  overflow-x-scroll gap-4  ">
        {categories.map((category, index) => (
          <CategoryPageCard
            key={category.id}
            id={category.id}
            title={category.name}
            route_map={category.route_map}
            description={category.short_description}
            image={category.image}
            blurLevel={0}
            imageLoaded={imageLoaded}
            handleImageLoaded={handleImageLoaded}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

export default TravelCategories
