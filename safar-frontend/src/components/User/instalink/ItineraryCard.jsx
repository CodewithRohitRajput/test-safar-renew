"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PDFDownloadModal from "./PDFDownloadModal";

const ItineraryCard = ({ itinerary }) => {
  const router = useRouter();
  const [showPDFModal, setShowPDFModal] = useState(false);

  const handlePDFDownload = (e) => {
    e.stopPropagation();
    if (itinerary.itin_pdf) {
      setShowPDFModal(true);
    } else {
      alert("PDF not available for this itinerary");
    }
  };

  const handleActualDownload = () => {
    if (itinerary.itin_pdf) {
      window.open(itinerary.itin_pdf, "_blank");
    }
  };

  
  console.log('Itinerary data:', itinerary);

  
  const handleBookClick = (e) => {
  e.stopPropagation();
  
  
  router.push(`/itinerary/${itinerary.route_map}`);
};

  const formatBatchDates = (batches) => {
    if (!batches || batches.length === 0) return "No batches available";
    return batches
      .map((date) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        });
      })
      .join(", ");
  };

  return (
    <div className="w-full">
      {/* Mobile Layout - Horizontal Card */}
      <div className="block md:hidden">
        <div className="rounded-lg overflow-hidden shadow-md mb-3">
          {/* Top Section */}
          <div className="flex items-center bg-gray-100 px-3 py-3">
            {/* Thumbnail */}
            <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-white">
              <img
                src={itinerary.thumbnail}
                alt={itinerary.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/assets/svgs/images/default-itinerary.png";
                }}
              />
            </div>

            {/* Title */}
            <div className="ml-3 flex-1">
              <h3 className="text-xs font-semibold text-gray-900 leading-tight line-clamp-3">
                {itinerary.title}
              </h3>
            </div>

            {/* Buttons */}
            <div className="flex space-x-2 ml-3">
              <button
                onClick={handlePDFDownload}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-3 py-1 rounded"
              >
                PDF
              </button>
              <button
                onClick={handleBookClick}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-3 py-1 rounded"
              >
                Book
              </button>
            </div>
          </div>

          {/* Batch Section */}
          <div className="bg-gray-500 px-3 py-2">
            <p className="text-xs text-white">
              <span className="font-medium">Batches:</span>{" "}
              {formatBatchDates(itinerary.batches)}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Vertical Card */}
      <div className="hidden md:block">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={itinerary.thumbnail}
              alt={itinerary.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/assets/svgs/images/default-itinerary.png";
              }}
            />
            <div className="absolute top-2 right-2">
              <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">
                {itinerary.city}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4">
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
              {itinerary.title}
            </h3>

            {/* Batch Section */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Available Batches:</span>
              </p>
              <p className="text-sm text-gray-700">
                {formatBatchDates(itinerary.batches)}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handlePDFDownload}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded transition-colors duration-200"
              >
                Download PDF
              </button>
              <button
                onClick={handleBookClick}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded transition-colors duration-200"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Download Modal */}
      <PDFDownloadModal
        isOpen={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        itinerary={itinerary}
        onDownload={handleActualDownload}
      />
    </div>
  );
};

export default ItineraryCard;