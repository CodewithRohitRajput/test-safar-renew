"use client";

import React from "react";

const MobileStickyPriceBar = ({
  selectedPackage,
  base_packages,
  selectedStartingPoint,
  selectedDroppingPoint,
  selectedBatch,
  openPopup,
  handleSubmit,
}) => {
  // Don't render if base_packages is not available
  if (!base_packages || !Array.isArray(base_packages) || base_packages.length === 0) {
    return null;
  }

  // Calculate prices using EXACT same logic as PricingComponent
  const discountedPrice = 
    (selectedPackage?.discounted_price || base_packages?.[0]?.discounted_price || 0) +
    (selectedStartingPoint?.price || 0) +
    (selectedDroppingPoint?.price || 0) +
    (selectedBatch?.extra_amount || 0);

  // Calculate original price for strikethrough and booking amount
  const originalPrice = 
    (selectedPackage?.original_price || base_packages?.[0]?.original_price || 0) +
    (selectedStartingPoint?.price || 0) +
    (selectedDroppingPoint?.price || 0);

  // Don't render if price is 0 or invalid
  if (!discountedPrice || discountedPrice === 0 || isNaN(discountedPrice)) {
    return null;
  }

  // Use original price for booking amount (as requested)
  const bookingAmount = originalPrice || discountedPrice;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[9999] md:hidden bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] rounded-t-2xl"
      style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 9999,
        width: '100%',
        borderTopLeftRadius: '0rem',
        borderTopRightRadius: '0rem'
      }}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left Side - Price Information */}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-600 mb-1">Starts From</div>
            <div className="flex items-baseline gap-2 flex-wrap">
              {originalPrice > discountedPrice && originalPrice > 0 && (
                <span className="line-through text-gray-400 text-sm">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-1xl font-bold text-orange-500">
                ₹{discountedPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-gray-500">+5% GST</span>
            </div>
          </div>

          {/* Right Side - Book Now Button */}
          <button
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-4 py-3 rounded-2xl font-bold text-sm transition duration-300 flex flex-col items-center justify-center min-w-[110px] flex-shrink-0"
            style={{ borderRadius: '1rem' }}
          >
            <span className="leading-tight">Book Now</span>
            <span className="text-xs font-normal leading-tight">at ₹ {discountedPrice.toLocaleString('en-IN')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileStickyPriceBar;