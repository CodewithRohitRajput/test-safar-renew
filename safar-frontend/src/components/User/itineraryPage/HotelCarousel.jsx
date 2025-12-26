import React, { useState, useRef, useEffect } from "react";
import { FaHotel, FaCamera } from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const HotelCarousel = ({ hotels }) => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const scrollRef = useRef(null);

  const openGallery = (images, e) => {
    e.stopPropagation(); // Prevent card click
    setGalleryImages(images || []);
    setShowGallery(true);
  };

  // Check scroll position to hide arrows when start/end is reached
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    handleScroll();
  }, []);

  const HotelCard = ({ hotel }) => {
    return (
      <div
        onClick={() => {
          if (hotel.reference) {
            window.open(hotel.reference, "_blank", "noopener,noreferrer");
          }
        }}
        className="bg-[#f3f4f6] rounded-lg shadow-lg overflow-hidden flex flex-col w-80 flex-shrink-0 cursor-pointer hover:scale-[1.02] transition-transform"
      >
        {/* Image */}
        <div className="relative h-40 w-full">
          <img
            src={
              hotel.images && hotel.images.length > 0
                ? hotel.images[0]
                : "/placeholder-hotel.jpg"
            }
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          {/* Gallery Button */}
          <div className="absolute bottom-2 right-2">
            <button
              onClick={(e) => openGallery(hotel.images, e)}
              className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 hover:bg-opacity-90 transition-all"
            >
              <FaCamera size={10} />
              Gallery
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="p-1 flex flex-col justify-start">
          <h3 className="font-bold text-black text-sm mb-1 truncate">
            {hotel.name}
          </h3>
          <span className="text-black text-xs mb-1">
            {hotel.rating || 5} ★ Hotel
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Hotels Section */}
      <section id="hotels" className="p-8 bg-[#0f172a] relative">
        <div className="flex items-center mb-6">
          <FaHotel className="text-white text-xl mr-2" />
          <h2 className="text-2xl font-titleMedium text-white">Hotels</h2>
        </div>

        {/* Horizontal Scroll */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto no-scrollbar pr-8"
        >
          {hotels?.map((hotel, index) => (
            <HotelCard key={hotel.id || index} hotel={hotel} />
          ))}
        </div>

        {/* Left Arrow */}
        {showLeftArrow && (
          <div
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-60 p-2 rounded-full cursor-pointer hover:bg-opacity-80 transition-all"
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
              }
            }}
          >
            <IoIosArrowBack className="text-white text-lg" />
          </div>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <div
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-60 p-2 rounded-full cursor-pointer hover:bg-opacity-80 transition-all"
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
              }
            }}
          >
            <IoIosArrowForward className="text-white text-lg" />
          </div>
        )}
      </section>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full relative">
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-2 right-2 text-black text-xl font-bold"
            >
              ✕
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {galleryImages.length > 0 ? (
                galleryImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Hotel Image ${idx + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))
              ) : (
                <p className="text-center">No images available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HotelCarousel;
