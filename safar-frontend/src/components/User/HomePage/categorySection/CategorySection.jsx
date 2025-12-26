"use client";

import React, { useRef, useState, useEffect } from "react";
import Card from "../../components/HomeCategoryCard";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CategorySection = () => {
  const categories = useSelector((state) => state.global.homeCategories) || [];
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);
  const [blurLevels, setBlurLevels] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(
    Array(categories.length).fill(false)
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const children = Array.from(container.children[0].children);

    const observer = new IntersectionObserver(
      (entries) => {
        const newBlurLevels = entries.map((entry) => {
          const visibleRatio = entry.intersectionRatio;
          const blurIntensity = Math.max(0, 1 - visibleRatio);
          return blurIntensity;
        });

        setBlurLevels((prev) => {
          const updatedLevels = [...prev];
          entries.forEach((entry, idx) => {
            const index = children.indexOf(entry.target);
            updatedLevels[index] = newBlurLevels[idx];
          });
          return updatedLevels;
        });
      },
      {
        root: container,
        threshold: Array.from({ length: 11 }, (_, i) => i / 10),
      }
    );

    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [categories, dispatch]);

  const handleImageLoaded = (index) => {
    setImageLoaded((prev) => {
      const updatedLoaded = [...prev];
      updatedLoaded[index] = true;
      return updatedLoaded;
    });
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="my-10 md:mx-14 md:my-20">
      <div className="mx-auto text-center">
        <h2 className="mb-3 font-medium text-2xl md:text-5xl">
          <span className="text-orange-500">Find </span>
          Your Tribe,<span className="text-orange-500"> Travel </span>Your Way!
        </h2>
        <div className="mx-auto mb-20 font-titleRegular text-sm text-gray-500 md:text-base">
          <p>
            Curated group adventures by Safar Wanderlust — designed to connect,
            inspire, and awaken the traveller in you.
          </p>
        </div>

        {/* Desktop + Mobile SAME Design */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 hidden md:block"
          >
            <FaChevronLeft />
          </button>

          <div
            className="no-scrollbar overflow-x-auto"
            ref={scrollContainerRef}
          >
            <div className="flex space-x-4 px-4">
              {categories.map((category, index) => (
                <Card
                  key={index}
                  route_map={category.route_map}
                  description={category.short_description}
                  image={category.image}
                  blurLevel={blurLevels[index]}
                  imageLoaded={imageLoaded[index]}
                  handleImageLoaded={handleImageLoaded}
                  index={index}
                  id={category.id}
                  className="
                   w-[calc(100%/2.5)] h-[180px]  
                   sm:w-[calc(100%/3)] sm:h-[200px] 
                   md:w-[260px] md:h-[340px] 
                   flex-shrink-0
                  "
                />
              ))}
              <div className="min-w-10"></div>
            </div>
          </div>

          {/* Right arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 hidden md:block"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
